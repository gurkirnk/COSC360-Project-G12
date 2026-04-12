import { getDb } from "../../db/mongoClient.js";
import { ObjectId } from "mongodb";

function toObjectId(value) {
  return value instanceof ObjectId ? value : new ObjectId(value);
}

export async function findActiveReservationByListingId(listingId) {
  const db = await getDb();

  return db.collection("reservations").findOne({
    listingId: toObjectId(listingId),
    status: "active",
  });
}

export async function findReservationById(reservationId) {
  const db = await getDb();

  return db.collection("reservations").findOne({
    _id: toObjectId(reservationId),
  });
}

export async function findReservationsByBorrowerUserId(borrowerUserId) {
  const db = await getDb();

  return db
    .collection("reservations")
    .find({
      borrowerUserId,
    })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createReservationRecord({
  listingId,
  ownerUserId,
  borrowerUserId,
  conversationId = null,
  durationDays,
  startsAt,
  endsAt,
}) {
  const db = await getDb();
  const now = new Date();
  const document = {
    listingId: toObjectId(listingId),
    ownerUserId,
    borrowerUserId,
    conversationId: conversationId ? toObjectId(conversationId) : null,
    status: "active",
    durationDays,
    startsAt,
    endsAt,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("reservations").insertOne(document);
  return {
    _id: result.insertedId,
    ...document,
  };
}

export async function updateReservationRecordStatus(reservationId, status) {
  const db = await getDb();

  return db.collection("reservations").findOneAndUpdate(
    { _id: toObjectId(reservationId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}
