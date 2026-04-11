import { getDb } from "../../db/mongoClient.js";
import { ObjectId } from "mongodb";

function toObjectId(value) {
  return value instanceof ObjectId ? value : new ObjectId(value);
}

export async function findConversationByParticipantsAndListing({
  listingId,
  ownerUserId,
  participantUserId,
}) {
  const db = await getDb();

  return db.collection("conversations").findOne({
    listingId: toObjectId(listingId),
    ownerUserId,
    participantUserId,
  });
}

export async function createConversationRecord({
  listingId,
  ownerUserId,
  participantUserId,
}) {
  const db = await getDb();
  const now = new Date();
  const document = {
    listingId: toObjectId(listingId),
    ownerUserId,
    participantUserId,
    createdAt: now,
    updatedAt: now,
    lastMessageAt: null,
  };

  const result = await db.collection("conversations").insertOne(document);
  return {
    _id: result.insertedId,
    ...document,
  };
}

export async function findConversationById(conversationId) {
  const db = await getDb();

  return db.collection("conversations").findOne({
    _id: toObjectId(conversationId),
  });
}

export async function findConversationsForUser(userId) {
  const db = await getDb();

  return db
    .collection("conversations")
    .find({
      $or: [{ ownerUserId: userId }, { participantUserId: userId }],
    })
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray();
}

export async function findMessagesByConversationId(conversationId) {
  const db = await getDb();

  return db
    .collection("messages")
    .find({
      conversationId: toObjectId(conversationId),
    })
    .sort({ createdAt: 1 })
    .toArray();
}

export async function createMessageRecord({
  conversationId,
  senderId,
  body,
  type = "text",
}) {
  const db = await getDb();
  const now = new Date();
  const document = {
    conversationId: toObjectId(conversationId),
    senderId,
    body,
    type,
    createdAt: now,
  };

  const result = await db.collection("messages").insertOne(document);

  await db.collection("conversations").updateOne(
    { _id: toObjectId(conversationId) },
    {
      $set: {
        updatedAt: now,
        lastMessageAt: now,
      },
    }
  );

  return {
    _id: result.insertedId,
    ...document,
  };
}
