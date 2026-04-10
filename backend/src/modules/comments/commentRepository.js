import mongoose from "mongoose";
import { connectMongoose } from "../../db/mongoClient.js";
import { Comment } from "./commentModel.js";

function toCommentObject(comment) {
  const plain = comment.toJSON();
  plain.replies = [];
  return plain;
}

async function resolveListingIdFromAncestor(parentCommentId) {
  let currentParentId = parentCommentId;

  while (currentParentId) {
    const currentParent = await Comment.findById(currentParentId).select("listingId parentCommentId");

    if (!currentParent) {
      return null;
    }

    if (currentParent.listingId) {
      return currentParent.listingId;
    }

    currentParentId = currentParent.parentCommentId;
  }

  return null;
}

export async function findCommentChainByListingId(listingId) {
  await connectMongoose();

  if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
    throw Object.assign(new Error("Valid listingId is required"), {
      statusCode: 400,
    });
  }

  const comments = await Comment.find({
    listingId,
    deletedAt: null,
  })
    .sort({ createdAt: 1 })
    .populate("authorId", "name profilePictureLink role")
    .exec();

  const byId = new Map();
  const roots = [];

  for (const comment of comments) {
    byId.set(comment.id, toCommentObject(comment));
  }

  for (const comment of byId.values()) {
    const parentId = comment.parentCommentId?.toString?.();

    if (parentId && byId.has(parentId)) {
      byId.get(parentId).replies.push(comment);
    } else {
      roots.push(comment);
    }
  }

  return roots;
}

export async function insertComment(commentInput) {
  await connectMongoose();

  const {
    body,
    authorId,
    listingId: rawListingId = null,
    parentCommentId: rawParentCommentId = null,
  } = commentInput ?? {};

  const bodyText = typeof body === "string" ? body.trim() : "";

  if (!authorId) {
    throw Object.assign(new Error("authorId is required"), {
      statusCode: 400,
    });
  }

  if (!bodyText) {
    throw Object.assign(new Error("body is required"), {
      statusCode: 400,
    });
  }

  if (!rawListingId && !rawParentCommentId) {
    throw Object.assign(new Error("Either listingId or parentCommentId is required"), {
      statusCode: 400,
    });
  }

  if (rawListingId && !mongoose.Types.ObjectId.isValid(rawListingId)) {
    throw Object.assign(new Error("Valid listingId is required"), {
      statusCode: 400,
    });
  }

  if (rawParentCommentId && !mongoose.Types.ObjectId.isValid(rawParentCommentId)) {
    throw Object.assign(new Error("Valid parentCommentId is required"), {
      statusCode: 400,
    });
  }

  let listingId = rawListingId;

  if (rawParentCommentId) {
    const parentComment = await Comment.findById(rawParentCommentId).select("listingId parentCommentId");

    if (!parentComment) {
      throw Object.assign(new Error("Parent comment not found"), {
        statusCode: 404,
      });
    }

    if (!listingId) {
      listingId = parentComment.listingId || (await resolveListingIdFromAncestor(parentComment.parentCommentId));
    }
  }

  if (!listingId) {
    throw Object.assign(new Error("Unable to determine listingId for comment"), {
      statusCode: 400,
    });
  }

  const createdComment = await Comment.create({
    listingId,
    authorId,
    parentCommentId: rawParentCommentId,
    body: bodyText,
  });

  await createdComment.populate("authorId", "name profilePictureLink role");

  return toCommentObject(createdComment);
}
