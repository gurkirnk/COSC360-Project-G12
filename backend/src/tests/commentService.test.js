import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addComment,
  deleteComment,
  getCommentChainForListing,
} from "../modules/comments/commentService.js";
import {
  createCommentRecord,
  findCommentById,
  findCommentsByListingId,
  markCommentDeleted,
} from "../modules/comments/commentRepository.js";

vi.mock("../modules/comments/commentRepository.js", () => ({
  createCommentRecord: vi.fn(),
  findCommentById: vi.fn(),
  findCommentsByListingId: vi.fn(),
  markCommentDeleted: vi.fn(),
}));

const LISTING_ID = "507f1f77bcf86cd799439011";
const OTHER_LISTING_ID = "507f1f77bcf86cd799439012";
const ROOT_COMMENT_ID = "507f1f77bcf86cd799439013";
const REPLY_COMMENT_ID = "507f1f77bcf86cd799439014";
const DELETED_COMMENT_ID = "507f1f77bcf86cd799439015";
const AUTHOR_ID = "507f1f77bcf86cd799439016";
const OTHER_AUTHOR_ID = "507f1f77bcf86cd799439017";

function makeCommentDoc({
  id,
  listingId = LISTING_ID,
  parentCommentId = null,
  authorId = { id: AUTHOR_ID, name: "Alice" },
  body = "Hello world",
  createdAt = "2026-04-11T08:30:00.000Z",
  deletedAt = null,
} = {}) {
  return {
    id,
    listingId,
    parentCommentId,
    authorId,
    body,
    createdAt,
    deletedAt,
    toJSON() {
      return {
        id,
        listingId,
        parentCommentId,
        authorId,
        body,
        createdAt,
        deletedAt,
      };
    },
  };
}

describe("commentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid listing ids when fetching a comment chain", async () => {
    await expect(getCommentChainForListing("not-an-object-id")).rejects.toMatchObject({
      message: "Valid listingId is required",
      statusCode: 400,
    });

    expect(findCommentsByListingId).not.toHaveBeenCalled();
  });

  it("builds nested comment chains and sanitizes deleted comments", async () => {
    findCommentsByListingId.mockResolvedValue([
      makeCommentDoc({
        id: ROOT_COMMENT_ID,
        body: "Root comment",
        authorId: { id: AUTHOR_ID, name: "Alice" },
      }),
      makeCommentDoc({
        id: REPLY_COMMENT_ID,
        parentCommentId: ROOT_COMMENT_ID,
        body: "Nested reply",
        authorId: { id: OTHER_AUTHOR_ID, name: "Bob" },
      }),
      makeCommentDoc({
        id: DELETED_COMMENT_ID,
        listingId: OTHER_LISTING_ID,
        body: "Original deleted body",
        deletedAt: "2026-04-10T00:00:00.000Z",
        authorId: { id: OTHER_AUTHOR_ID, name: "Carol" },
      }),
    ]);

    const result = await getCommentChainForListing(LISTING_ID);

    expect(findCommentsByListingId).toHaveBeenCalledWith(LISTING_ID);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: ROOT_COMMENT_ID,
      body: "Root comment",
    });
    expect(result[0].replies).toHaveLength(1);
    expect(result[0].replies[0]).toMatchObject({
      id: REPLY_COMMENT_ID,
      body: "Nested reply",
    });
    expect(result[1]).toMatchObject({
      id: DELETED_COMMENT_ID,
      body: "this comment was deleted",
      authorId: null,
      deletedAt: "2026-04-10T00:00:00.000Z",
    });
    expect(result[1].replies).toEqual([]);
  });

  it("inherits the listing id from the parent comment when creating a reply", async () => {
    const parentComment = {
      listingId: LISTING_ID,
      deletedAt: null,
    };
    const createdComment = makeCommentDoc({
      id: REPLY_COMMENT_ID,
      parentCommentId: ROOT_COMMENT_ID,
      body: "Trimmed reply",
    });

    findCommentById.mockResolvedValue(parentComment);
    createCommentRecord.mockResolvedValue(createdComment);

    const result = await addComment({
      body: "  Trimmed reply  ",
      authorId: AUTHOR_ID,
      listingId: LISTING_ID,
      parentCommentId: ROOT_COMMENT_ID,
    });

    expect(findCommentById).toHaveBeenCalledWith(ROOT_COMMENT_ID);
    expect(createCommentRecord).toHaveBeenCalledWith({
      listingId: LISTING_ID,
      authorId: AUTHOR_ID,
      parentCommentId: ROOT_COMMENT_ID,
      body: "Trimmed reply",
    });
    expect(result).toMatchObject({
      id: REPLY_COMMENT_ID,
      body: "Trimmed reply",
    });
  });

  it("rejects replies to deleted comments", async () => {
    findCommentById.mockResolvedValue({
      listingId: LISTING_ID,
      deletedAt: new Date("2026-04-10T00:00:00.000Z"),
    });

    await expect(
      addComment({
        body: "Reply",
        authorId: AUTHOR_ID,
        parentCommentId: ROOT_COMMENT_ID,
      })
    ).rejects.toMatchObject({
      message: "Cannot reply to a deleted comment",
      statusCode: 410,
    });

    expect(createCommentRecord).not.toHaveBeenCalled();
  });

  it("soft deletes comments owned by the requesting user", async () => {
    findCommentById.mockResolvedValue({
      authorId: {
        toString: () => AUTHOR_ID,
      },
      deletedAt: null,
    });
    markCommentDeleted.mockResolvedValue(
      makeCommentDoc({
        id: ROOT_COMMENT_ID,
        body: "Original body",
        deletedAt: "2026-04-10T00:00:00.000Z",
      })
    );

    const result = await deleteComment(ROOT_COMMENT_ID, AUTHOR_ID);

    expect(markCommentDeleted).toHaveBeenCalledWith(ROOT_COMMENT_ID);
    expect(result).toMatchObject({
      id: ROOT_COMMENT_ID,
      body: "this comment was deleted",
      authorId: null,
    });
  });

  it("rejects deletes from other users", async () => {
    findCommentById.mockResolvedValue({
      authorId: {
        toString: () => OTHER_AUTHOR_ID,
      },
      deletedAt: null,
    });

    await expect(deleteComment(ROOT_COMMENT_ID, AUTHOR_ID)).rejects.toMatchObject({
      message: "Forbidden",
      statusCode: 403,
    });

    expect(markCommentDeleted).not.toHaveBeenCalled();
  });
});
