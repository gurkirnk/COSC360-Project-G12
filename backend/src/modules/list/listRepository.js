import { getDb } from "../../db/mongoClient.js";

export async function createListing({ title, genre, format, description, userId }) {
  const db = await getDb();
  const document = {
    title,
    genre,
    format,
    description,
    createdAt: new Date(),
    userId,
  };

  const result = await db.collection("listings").insertOne(document);
  return {
    id: result.insertedId.toString(),
    title: document.title,
    genre: document.genre,
    format: document.format,
    description: document.description,
    createdAt: document.createdAt,
    userId: document.userId
  };
}