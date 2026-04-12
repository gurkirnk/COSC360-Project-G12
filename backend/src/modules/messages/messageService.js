import mongoose from "mongoose";
import { findUserById } from "../auth/authAndUserRepository.js";
import { findListingById } from "../listing/listRepository.js";
import { findActiveReservationByConversationId } from "../reservations/reservationRepository.js";
import {
  createConversationRecord,
  createMessageRecord,
  findConversationById,
  findConversationByParticipantsAndListing,
  findConversationsForUser,
  findMessagesByConversationId,
} from "./messageRepository.js";

function assertValidObjectId(value, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw Object.assign(new Error(`Valid ${fieldName} is required`), {
      statusCode: 400,
    });
  }
}

function requireUserId(userId, fieldName = "userId") {
  if (!userId) {
    throw Object.assign(new Error(`${fieldName} is required`), {
      statusCode: 400,
    });
  }
}

function hasConversationAccess(conversation, userId) {
  return (
    conversation &&
    (conversation.ownerUserId?.toString?.() === userId.toString() ||
      conversation.participantUserId?.toString?.() === userId.toString())
  );
}

function serializeListing(listing) {
  if (!listing) {
    return null;
  }

  return {
    id: listing._id?.toString?.() ?? listing.id ?? "",
    title: listing.title,
    description: listing.description,
    genre: listing.genre,
    format: listing.format,
    createdAt: listing.createdAt,
    userId: listing.userId,
  };
}

function serializeConversation(conversation) {
  if (!conversation) {
    return null;
  }

  return {
    id: conversation._id?.toString?.() ?? conversation.id ?? "",
    listingId: conversation.listingId?.toString?.() ?? "",
    ownerUserId: conversation.ownerUserId,
    participantUserId: conversation.participantUserId,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    lastMessageAt: conversation.lastMessageAt,
  };
}

function serializeMessage(message) {
  return {
    id: message._id?.toString?.() ?? message.id ?? "",
    conversationId: message.conversationId?.toString?.() ?? "",
    senderId: message.senderId,
    body: message.body,
    type: message.type ?? "text",
    createdAt: message.createdAt,
  };
}

function serializeReservation(reservation) {
  if (!reservation) {
    return null;
  }

  return {
    id: reservation._id?.toString?.() ?? reservation.id ?? "",
    listingId: reservation.listingId?.toString?.() ?? "",
    ownerUserId: reservation.ownerUserId,
    borrowerUserId: reservation.borrowerUserId,
    conversationId: reservation.conversationId?.toString?.() ?? null,
    status: reservation.status,
    durationDays: reservation.durationDays,
    startsAt: reservation.startsAt,
    endsAt: reservation.endsAt,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id ?? user._id?.toString?.() ?? "",
    name: user.name ?? "",
    role: user.role ?? "",
    profilePictureLink: user.profilePictureLink ?? null,
  };
}

async function hydrateConversationSummary(conversation, currentUserId) {
  const [listing, ownerUser, participantUser, activeReservation] = await Promise.all([
    findListingById(conversation.listingId.toString()),
    findUserById(conversation.ownerUserId),
    findUserById(conversation.participantUserId),
    findActiveReservationByConversationId(conversation._id?.toString?.() ?? conversation.id),
  ]);

  const counterpartId =
    conversation.ownerUserId === currentUserId
      ? conversation.participantUserId
      : conversation.ownerUserId;

  return {
    ...serializeConversation(conversation),
    listing: serializeListing(listing),
    ownerUser: serializeUser(ownerUser),
    participantUser: serializeUser(participantUser),
    counterpartUserId: counterpartId,
    hasActiveReservation: Boolean(activeReservation),
  };
}

export async function createConversationForListing({ listingId, userId }) {
  requireUserId(userId);

  if (!listingId) {
    throw Object.assign(new Error("listingId is required"), {
      statusCode: 400,
    });
  }

  assertValidObjectId(listingId, "listingId");

  const listing = await findListingById(listingId);
  if (!listing) {
    throw Object.assign(new Error("Listing not found"), {
      statusCode: 404,
    });
  }

  const ownerUserId = listing.userId?.toString?.() ?? "";

  if (!ownerUserId) {
    throw Object.assign(new Error("Listing owner missing"), {
      statusCode: 400,
    });
  }

  if (ownerUserId === userId.toString()) {
    throw Object.assign(new Error("You cannot message your own listing"), {
      statusCode: 400,
    });
  }

  const existingConversation = await findConversationByParticipantsAndListing({
    listingId,
    ownerUserId,
    participantUserId: userId,
  });

  const conversation =
    existingConversation ??
    (await createConversationRecord({
      listingId,
      ownerUserId,
      participantUserId: userId,
    }));

  return hydrateConversationSummary(conversation, userId);
}

export async function listUserConversations(userId) {
  requireUserId(userId);

  const conversations = await findConversationsForUser(userId);

  return Promise.all(
    conversations.map((conversation) =>
      hydrateConversationSummary(conversation, userId)
    )
  );
}

export async function getConversationDetails(conversationId, userId) {
  requireUserId(userId);

  if (!conversationId) {
    throw Object.assign(new Error("conversationId is required"), {
      statusCode: 400,
    });
  }

  assertValidObjectId(conversationId, "conversationId");

  const conversation = await findConversationById(conversationId);
  if (!conversation) {
    throw Object.assign(new Error("Conversation not found"), {
      statusCode: 404,
    });
  }

  if (!hasConversationAccess(conversation, userId)) {
    throw Object.assign(new Error("Forbidden"), {
      statusCode: 403,
    });
  }

  const [summary, messages, activeReservation] = await Promise.all([
    hydrateConversationSummary(conversation, userId),
    findMessagesByConversationId(conversationId),
    findActiveReservationByConversationId(conversationId),
  ]);

  return {
    conversation: summary,
    messages: messages.map(serializeMessage),
    reservation: serializeReservation(activeReservation),
  };
}

export async function sendMessageToConversation({
  conversationId,
  senderId,
  body,
}) {
  requireUserId(senderId, "senderId");

  if (!conversationId) {
    throw Object.assign(new Error("conversationId is required"), {
      statusCode: 400,
    });
  }

  assertValidObjectId(conversationId, "conversationId");

  const trimmedBody = typeof body === "string" ? body.trim() : "";
  if (!trimmedBody) {
    throw Object.assign(new Error("body is required"), {
      statusCode: 400,
    });
  }

  const conversation = await findConversationById(conversationId);
  if (!conversation) {
    throw Object.assign(new Error("Conversation not found"), {
      statusCode: 404,
    });
  }

  if (!hasConversationAccess(conversation, senderId)) {
    throw Object.assign(new Error("Forbidden"), {
      statusCode: 403,
    });
  }

  const createdMessage = await createMessageRecord({
    conversationId,
    senderId,
    body: trimmedBody,
  });

  return serializeMessage(createdMessage);
}
