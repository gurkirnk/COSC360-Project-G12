import { ObjectId } from "mongodb";
import { getDb } from "../../db/mongoClient.js";

export async function createUser({ name, email, password: hashedPassword, role }) {
  const db = await getDb();
  const document = {
    name,
    email,
    hashedPassword,
    role,
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(document);
  return {
    id: result.insertedId.toString(),
    name: document.name,
    email: document.email,
    role: document.role,
    createdAt: document.createdAt,
  };
}

export async function findUserByEmail(email) {
  const db = await getDb();
  return await db.collection("users").findOne({ email });
}

export async function findUserByName(name) {
  const db = await getDb();
  return await db.collection("users").findOne({ name });
}

export async function findUserById(id) {
  const db = await getDb();
  return await db.collection("users").findOne({ _id: new ObjectId(id) });
}
