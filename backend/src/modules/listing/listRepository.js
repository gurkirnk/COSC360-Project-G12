import { getDb } from "../../db/mongoClient.js";
import { ObjectId } from 'mongodb'

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
  const filter = { _id: new ObjectId(listingId) }
  const document = {
    $set: {
      title: title,
      genre: genre,
      format: format,
      description: description,
    }
  };

  const result = await db.collection("listings").findOneAndUpdate(filter, document, { returnDocument: "after" });
  return result;
}

export async function deleteListing(listingId) {
  const db = await getDb();
  const filter = { _id: new ObjectId(listingId) }

  const result = await db.collection("listings").deleteOne(filter);
  return result;
}

export async function findListingById(listingId) {
  const db = await getDb();
  const filter = { _id: new ObjectId(listingId) };
  const result = await db.collection("listings").findOne(filter);
  return result;
}

export async function getListings({ search, genre }) {
  const db = await getDb();

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (genre) {
    query.genre = genre;
  }
  const results = await db
    .collection("listings")
    .find(query)
    .toArray();

  return results;
}

export async function getListingsByUserId(id) {
  const db = await getDb();

  const query = {};

  if (search) {
    query.userId = id;
  }

  const results = await db
    .collection("listings")
    .find(query)
    .toArray();

  return results;
}

export async function getListingsById(id) {
  const db = await getDb();

  const query = {};
  query._id = new ObjectId(id);

  const results = await db
    .collection("listings")
    .find(query)
    .toArray();

  return results;
}
