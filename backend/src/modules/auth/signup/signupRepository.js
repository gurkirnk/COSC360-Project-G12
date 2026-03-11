import { getDb } from "../../../db/mongoClient.js";

export async function createUser(username, password) {
  const db = await getDb();
  const document = {
    username,
    password,
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(document);
  return {
    id: result.insertedId.toString(),
    username: document.username,
    createdAt: document.createdAt,
  };
}

export async function userExists(username) {
  const db = await getDb();
  const user = await db.collection("users").findOne({ username });
  return user !== null;
}