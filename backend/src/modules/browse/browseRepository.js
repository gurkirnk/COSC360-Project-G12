import { getDb } from "../../db/mongoClient.js";
import { ObjectId } from 'mongodb';

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
