import { ObjectId } from "mongodb";
import { getDb } from "../../db/mongoClient.js";

export async function createImageEntry({ imageBase64, contentType, fileName }) {
  const db = await getDb();
  const document = {
    imageBase64,
    contentType,
    fileName,
    uploadedAt: new Date(),
  };
  const result = await db.collection("images").insertOne(document);
  return {
    id: result.insertedId.toString(),
    imageBase64: document.imageBase64,
    contentType: document.contentType,
    fileName: document.fileName,
    uploadedAt: document.uploadedAt,
  };
}

export async function findImageById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();
  return await db.collection("images").findOne({ _id: new ObjectId(id) });
}
