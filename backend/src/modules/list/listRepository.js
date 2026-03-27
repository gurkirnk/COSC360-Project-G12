import { getDb } from "../../db/mongoClient.js";
import {ObjectId} from 'mongodb'

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

export async function editListing({ title, genre, format, description, listingId }) {
  const db = await getDb();
  const filter = {_id:  new ObjectId(listingId)}
  const document = {
    $set: {
    title: title,
    genre: genre,
    format: format,
    description: description,
    }
  };

  const result = await db.collection("listings").findOneAndUpdate(filter, document, {returnDocument: "after"});
  return result;
}