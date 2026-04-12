import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createConversationForListing,
  sendMessageToConversation,
} from "../modules/messages/messageService.js";
import { findUserById } from "../modules/auth/authAndUserRepository.js";
import { findListingById } from "../modules/listing/listRepository.js";
import { findActiveReservationByListingId } from "../modules/reservations/reservationRepository.js";
import {
  createConversationRecord,
  createMessageRecord,
  findConversationById,
  findConversationByParticipantsAndListing,
} from "../modules/messages/messageRepository.js";

vi.mock("../modules/auth/authAndUserRepository.js", () => ({
  findUserById: vi.fn(),
}));

vi.mock("../modules/listing/listRepository.js", () => ({
  findListingById: vi.fn(),
}));

vi.mock("../modules/reservations/reservationRepository.js", () => ({
  findActiveReservationByListingId: vi.fn(),
}));

vi.mock("../modules/messages/messageRepository.js", () => ({
  createConversationRecord: vi.fn(),
  createMessageRecord: vi.fn(),
  findConversationById: vi.fn(),
  findConversationByParticipantsAndListing: vi.fn(),
  findConversationsForUser: vi.fn(),
  findMessagesByConversationId: vi.fn(),
}));

describe("messageService", () => {
  const LISTING_ID = "507f1f77bcf86cd799439011";
  const CONVERSATION_ID = "507f1f77bcf86cd799439012";
  const OWNER_ID = "owner-1";
  const PARTICIPANT_ID = "reader-1";

  beforeEach(() => {
    vi.clearAllMocks();
    findUserById.mockResolvedValue({ id: OWNER_ID, name: "User" });
    findActiveReservationByListingId.mockResolvedValue(null);
  });

  it("returns an existing listing conversation instead of creating a duplicate", async () => {
    findListingById.mockResolvedValue({
      _id: { toString: () => LISTING_ID },
      userId: OWNER_ID,
      title: "Dune",
      availabilityStatus: "available",
    });
    findConversationByParticipantsAndListing.mockResolvedValue({
      _id: { toString: () => CONVERSATION_ID },
      listingId: { toString: () => LISTING_ID },
      ownerUserId: OWNER_ID,
      participantUserId: PARTICIPANT_ID,
      createdAt: new Date("2026-04-11T08:00:00.000Z"),
      updatedAt: new Date("2026-04-11T08:00:00.000Z"),
      lastMessageAt: null,
    });

    const result = await createConversationForListing({
      listingId: LISTING_ID,
      userId: PARTICIPANT_ID,
    });

    expect(createConversationRecord).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      id: CONVERSATION_ID,
      listingId: LISTING_ID,
      ownerUserId: OWNER_ID,
      participantUserId: PARTICIPANT_ID,
    });
  });

  it("prevents users from creating conversations for their own listings", async () => {
    findListingById.mockResolvedValue({
      _id: { toString: () => LISTING_ID },
      userId: OWNER_ID,
    });

    await expect(
      createConversationForListing({
        listingId: LISTING_ID,
        userId: OWNER_ID,
      })
    ).rejects.toMatchObject({
      message: "You cannot message your own listing",
      statusCode: 400,
    });
  });

  it("sends trimmed messages only for conversation participants", async () => {
    findConversationById.mockResolvedValue({
      _id: { toString: () => CONVERSATION_ID },
      listingId: { toString: () => LISTING_ID },
      ownerUserId: OWNER_ID,
      participantUserId: PARTICIPANT_ID,
    });
    createMessageRecord.mockResolvedValue({
      _id: { toString: () => "507f1f77bcf86cd799439013" },
      conversationId: { toString: () => CONVERSATION_ID },
      senderId: PARTICIPANT_ID,
      body: "Hello there",
      type: "text",
      createdAt: new Date("2026-04-11T08:30:00.000Z"),
    });

    const result = await sendMessageToConversation({
      conversationId: CONVERSATION_ID,
      senderId: PARTICIPANT_ID,
      body: "  Hello there  ",
    });

    expect(createMessageRecord).toHaveBeenCalledWith({
      conversationId: CONVERSATION_ID,
      senderId: PARTICIPANT_ID,
      body: "Hello there",
    });
    expect(result).toMatchObject({
      conversationId: CONVERSATION_ID,
      senderId: PARTICIPANT_ID,
      body: "Hello there",
    });
  });
});
