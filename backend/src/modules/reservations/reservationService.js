import mongoose from "mongoose";
import { findListingById } from "../listing/listRepository.js";
import { findConversationById } from "../messages/messageRepository.js";
import {
  createReservationRecord,
  findActiveReservationByListingId,
  findReservationById,
  findReservationsByBorrowerUserId,
  updateReservationRecordStatus,
} from "./reservationRepository.js";

const ALLOWED_DURATION_DAYS = new Set([7, 14, 21, 30]);

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

export async function retrieveReservationsByBorrowerUserId(userId) {
  requireUserId(userId);

  const results = await findReservationsByBorrowerUserId(userId);

  return {
    results: results.map(serializeReservation),
  };
}

export async function createReservation({
  listingId,
  borrowerUserId,
  ownerUserId,
  conversationId = null,
  durationDays,
}) {
  requireUserId(ownerUserId, "ownerUserId");
  requireUserId(borrowerUserId, "borrowerUserId");

  if (!listingId) {
    throw Object.assign(new Error("listingId is required"), {
      statusCode: 400,
    });
  }

  assertValidObjectId(listingId, "listingId");

  if (conversationId) {
    assertValidObjectId(conversationId, "conversationId");
  }

  const normalizedDurationDays = Number(durationDays);
  if (!ALLOWED_DURATION_DAYS.has(normalizedDurationDays)) {
    throw Object.assign(new Error("durationDays must be one of 7, 14, 21, or 30"), {
      statusCode: 400,
    });
  }

  if (borrowerUserId.toString() === ownerUserId.toString()) {
    throw Object.assign(new Error("Owner cannot reserve their own listing"), {
      statusCode: 400,
    });
  }

  const listing = await findListingById(listingId);
  if (!listing) {
    throw Object.assign(new Error("Listing not found"), {
      statusCode: 404,
    });
  }

  if (listing.userId?.toString?.() !== ownerUserId.toString()) {
    throw Object.assign(new Error("Forbidden"), {
      statusCode: 403,
    });
  }

  const existingReservation = await findActiveReservationByListingId(listingId);
  if (existingReservation) {
    throw Object.assign(new Error("Listing already has an active reservation"), {
      statusCode: 409,
    });
  }

  if (conversationId) {
    const conversation = await findConversationById(conversationId);

    if (!conversation) {
      throw Object.assign(new Error("Conversation not found"), {
        statusCode: 404,
      });
    }

    if (conversation.listingId?.toString?.() !== listingId.toString()) {
      throw Object.assign(new Error("Conversation does not belong to this listing"), {
        statusCode: 400,
      });
    }

    if (conversation.ownerUserId?.toString?.() !== ownerUserId.toString()) {
      throw Object.assign(new Error("Conversation owner does not match listing owner"), {
        statusCode: 400,
      });
    }

    if (conversation.participantUserId?.toString?.() !== borrowerUserId.toString()) {
      throw Object.assign(new Error("Conversation participant does not match borrower"), {
        statusCode: 400,
      });
    }
  }

  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + normalizedDurationDays);

  const reservation = await createReservationRecord({
    listingId,
    ownerUserId,
    borrowerUserId,
    conversationId,
    durationDays: normalizedDurationDays,
    startsAt,
    endsAt,
  });

  return serializeReservation(reservation);
}

async function updateReservationStatus({ reservationId, userId, status }) {
  requireUserId(userId);

  if (!reservationId) {
    throw Object.assign(new Error("reservationId is required"), {
      statusCode: 400,
    });
  }

  assertValidObjectId(reservationId, "reservationId");

  const reservation = await findReservationById(reservationId);
  if (!reservation) {
    throw Object.assign(new Error("Reservation not found"), {
      statusCode: 404,
    });
  }

  if (reservation.ownerUserId?.toString?.() !== userId.toString()) {
    throw Object.assign(new Error("Forbidden"), {
      statusCode: 403,
    });
  }

  if (reservation.status !== "active") {
    return serializeReservation(reservation);
  }

  const updatedReservation = await updateReservationRecordStatus(reservationId, status);

  return serializeReservation(updatedReservation);
}

export async function cancelReservation(reservationId, userId) {
  return updateReservationStatus({ reservationId, userId, status: "cancelled" });
}

export async function completeReservation(reservationId, userId) {
  return updateReservationStatus({ reservationId, userId, status: "completed" });
}
