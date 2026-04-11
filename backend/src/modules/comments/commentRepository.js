import { connectMongoose } from "../../db/mongoClient.js";
import { Comment } from "./commentModel.js";

export async function findCommentsByListingId(listingId) {
  await connectMongoose();

  return Comment.find({
    listingId,
    deletedAt: null,
  })
    .sort({ createdAt: 1 })
    .populate("authorId", "name profilePictureLink role")
    .exec();
}

export async function findCommentById(commentId) {
  await connectMongoose();

  return Comment.findById(commentId)
    .select("listingId parentCommentId deletedAt")
    .exec();
}

export async function createCommentRecord({
  listingId,
  authorId,
  parentCommentId = null,
  body,
}) {
  await connectMongoose();

  const createdComment = await Comment.create({
    listingId,
    authorId,
    parentCommentId,
    body,
  });

  await createdComment.populate("authorId", "name profilePictureLink role");

  return createdComment;
}
