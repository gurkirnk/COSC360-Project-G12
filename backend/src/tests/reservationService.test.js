import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cancelReservation,
  createReservation,
  retrieveReservationsByBorrowerUserId,
} from "../modules/reservations/reservationService.js";
import { findListingById } from "../modules/listing/listRepository.js";
import { findConversationById } from "../modules/messages/messageRepository.js";
import {
  createReservationRecord,
  findActiveReservationByListingId,
  findReservationById,
  findReservationsByBorrowerUserId,
  updateReservationRecordStatus,
} from "../modules/reservations/reservationRepository.js";

vi.mock("../modules/listing/listRepository.js", () => ({
  findListingById: vi.fn(),
}));

vi.mock("../modules/messages/messageRepository.js", () => ({
  findConversationById: vi.fn(),
}));

vi.mock("../modules/reservations/reservationRepository.js", () => ({
  createReservationRecord: vi.fn(),
  findActiveReservationByListingId: vi.fn(),
  findReservationById: vi.fn(),
  findReservationsByBorrowerUserId: vi.fn(),
  updateReservationRecordStatus: vi.fn(),
}));

describe("reservationService", () => {
  const LISTING_ID = "507f1f77bcf86cd799439011";
  const RESERVATION_ID = "507f1f77bcf86cd799439012";
  const CONVERSATION_ID = "507f1f77bcf86cd799439013";
  const OWNER_ID = "owner-1";
  const BORROWER_ID = "reader-1";

  beforeEach(() => {
    vi.clearAllMocks();
    findListingById.mockResolvedValue({
      _id: { toString: () => LISTING_ID },
      userId: OWNER_ID,
    });
    findActiveReservationByListingId.mockResolvedValue(null);
    findConversationById.mockResolvedValue({
      _id: { toString: () => CONVERSATION_ID },
      listingId: { toString: () => LISTING_ID },
      ownerUserId: OWNER_ID,
      participantUserId: BORROWER_ID,
    });
  });

  it("creates a reservation without mutating the listing record", async () => {
    createReservationRecord.mockResolvedValue({
      _id: { toString: () => RESERVATION_ID },
      listingId: { toString: () => LISTING_ID },
      ownerUserId: OWNER_ID,
      borrowerUserId: BORROWER_ID,
      conversationId: { toString: () => CONVERSATION_ID },
      status: "active",
      durationDays: 14,
      startsAt: new Date("2026-04-11T08:00:00.000Z"),
      endsAt: new Date("2026-04-25T08:00:00.000Z"),
      createdAt: new Date("2026-04-11T08:00:00.000Z"),
      updatedAt: new Date("2026-04-11T08:00:00.000Z"),
    });

    const result = await createReservation({
      listingId: LISTING_ID,
      borrowerUserId: BORROWER_ID,
      ownerUserId: OWNER_ID,
      conversationId: CONVERSATION_ID,
      durationDays: 14,
    });

    expect(createReservationRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        listingId: LISTING_ID,
        borrowerUserId: BORROWER_ID,
        ownerUserId: OWNER_ID,
        conversationId: CONVERSATION_ID,
        durationDays: 14,
      })
    );
    expect(result).toMatchObject({
      id: RESERVATION_ID,
      status: "active",
      borrowerUserId: BORROWER_ID,
    });
  });

  it("retrieves reservations for a borrower", async () => {
    findReservationsByBorrowerUserId.mockResolvedValue([
      {
        _id: { toString: () => RESERVATION_ID },
        listingId: { toString: () => LISTING_ID },
        ownerUserId: OWNER_ID,
        borrowerUserId: BORROWER_ID,
        conversationId: { toString: () => CONVERSATION_ID },
        status: "active",
        durationDays: 14,
        startsAt: new Date("2026-04-11T08:00:00.000Z"),
        endsAt: new Date("2026-04-25T08:00:00.000Z"),
        createdAt: new Date("2026-04-11T08:00:00.000Z"),
        updatedAt: new Date("2026-04-11T08:00:00.000Z"),
      },
    ]);

    const result = await retrieveReservationsByBorrowerUserId(BORROWER_ID);

    expect(findReservationsByBorrowerUserId).toHaveBeenCalledWith(BORROWER_ID);
    expect(result).toMatchObject({
      results: [
        expect.objectContaining({
          id: RESERVATION_ID,
          listingId: LISTING_ID,
          borrowerUserId: BORROWER_ID,
        }),
      ],
    });
  });

  it("blocks duplicate active reservations for the same listing", async () => {
    findActiveReservationByListingId.mockResolvedValue({
      _id: { toString: () => RESERVATION_ID },
      status: "active",
    });

    await expect(
      createReservation({
        listingId: LISTING_ID,
        borrowerUserId: BORROWER_ID,
        ownerUserId: OWNER_ID,
        durationDays: 14,
      })
    ).rejects.toMatchObject({
      message: "Listing already has an active reservation",
      statusCode: 409,
    });

    expect(createReservationRecord).not.toHaveBeenCalled();
  });

  it("updates reservation status when an owner cancels an active reservation", async () => {
    findReservationById.mockResolvedValue({
      _id: { toString: () => RESERVATION_ID },
      listingId: { toString: () => LISTING_ID },
      ownerUserId: OWNER_ID,
      status: "active",
    });
    updateReservationRecordStatus.mockResolvedValue({
      _id: { toString: () => RESERVATION_ID },
      listingId: { toString: () => LISTING_ID },
      ownerUserId: OWNER_ID,
      borrowerUserId: BORROWER_ID,
      status: "cancelled",
      durationDays: 14,
      startsAt: new Date("2026-04-11T08:00:00.000Z"),
      endsAt: new Date("2026-04-25T08:00:00.000Z"),
      createdAt: new Date("2026-04-11T08:00:00.000Z"),
      updatedAt: new Date("2026-04-12T08:00:00.000Z"),
    });

    const result = await cancelReservation(RESERVATION_ID, OWNER_ID);

    expect(updateReservationRecordStatus).toHaveBeenCalledWith(RESERVATION_ID, "cancelled");
    expect(result).toMatchObject({
      id: RESERVATION_ID,
      status: "cancelled",
    });
  });
});
