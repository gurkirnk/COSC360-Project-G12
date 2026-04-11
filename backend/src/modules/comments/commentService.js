import mongoose from "mongoose";
import {
  createCommentRecord,
  findCommentById,
  findCommentsByListingId,
  markCommentDeleted,
} from "./commentRepository.js";

function toCommentObject(comment) {
  const plain = comment.toJSON();
  if (plain.deletedAt) {
    plain.body = "this comment was deleted";
    plain.authorId = null;
  }
  plain.replies = [];
  return plain;
}

function buildCommentTree(comments) {
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

function assertValidObjectId(value, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw Object.assign(new Error(`Valid ${fieldName} is required`), {
      statusCode: 400,
    });
  }
}

export async function getCommentChainForListing(listingId) {
  if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
    throw Object.assign(new Error("Valid listingId is required"), {
      statusCode: 400,
    });
  }

  const comments = await findCommentsByListingId(listingId);
  return buildCommentTree(comments);
}

export async function addComment(commentInput) {
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

  if (!bodyText ) {
    throw Object.assign(new Error("body is required"), {
      statusCode: 400,
    });
  }

  if (rawParentCommentId) {
    assertValidObjectId(rawParentCommentId, "parentCommentId");
  }

  let listingId = rawListingId;

  if (rawParentCommentId) {
    const parentComment = await findCommentById(rawParentCommentId);

    if (!parentComment) {
      throw Object.assign(new Error("Parent comment not found"), {
        statusCode: 404,
      });
    }

    if (!parentComment.listingId) {
      throw Object.assign(new Error("Parent comment is missing listingId - this should be impossible"), {
        statusCode: 400,
      });
    }

    if (parentComment.deletedAt) {
      throw Object.assign(new Error("Cannot reply to a deleted comment"), {
        statusCode: 410,
      });
    }

    if (rawListingId) {
      assertValidObjectId(rawListingId, "listingId");

      if (parentComment.listingId.toString() !== rawListingId.toString()) {
        throw Object.assign(new Error("listingId does not match the parent comment chain"), {
          statusCode: 400,
        });
      }
    }

    listingId = parentComment.listingId;
  } else {
    if (!rawListingId) {
      throw Object.assign(new Error("listingId is required"), {
        statusCode: 400,
      });
    }

    assertValidObjectId(rawListingId, "listingId");
  }

  if (!listingId) {
    throw Object.assign(new Error("Unable to determine listingId for comment"), {
      statusCode: 400,
    });
  }

  const createdComment = await createCommentRecord({
    listingId,
    authorId,
    parentCommentId: rawParentCommentId,
    body: bodyText,
  });

  return toCommentObject(createdComment);
}

export async function deleteComment(commentId, authorId) {
  if (!commentId) {
    throw Object.assign(new Error("commentId is required"), {
      statusCode: 400,
    });
  }

  assertValidObjectId(commentId, "commentId");

  const comment = await findCommentById(commentId);

  if (!comment) {
    throw Object.assign(new Error("Comment not found"), {
      statusCode: 404,
    });
  }

  if (comment.deletedAt) {
    return toCommentObject(comment);
  }

  if (!authorId) {
    throw Object.assign(new Error("authorId is required"), {
      statusCode: 400,
    });
  }

  if (comment.authorId?.toString?.() !== authorId.toString()) {
    throw Object.assign(new Error("Forbidden"), {
      statusCode: 403,
    });
  }

  // doing soft delete to preserve comment chain structure - the comment will be marked as deleted and its body will not be shown, but it will still exist in the database and can be returned in the comment chain (with a "this comment was deleted" body) to avoid orphaning replies
  const deletedComment = await markCommentDeleted(commentId);
  return toCommentObject(deletedComment);
}
