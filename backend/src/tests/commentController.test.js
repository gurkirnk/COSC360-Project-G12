import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import {
  createComment,
  getCommentChain,
  removeComment,
} from "../modules/comments/commentController.js";
import {
  addComment,
  deleteComment,
  getCommentChainForListing,
} from "../modules/comments/commentService.js";

vi.mock("../modules/comments/commentService.js", () => ({
  addComment: vi.fn(),
  deleteComment: vi.fn(),
  getCommentChainForListing: vi.fn(),
}));

describe("commentController", () => {
  let app;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      req.user = { sub: "507f1f77bcf86cd799439016" };
      next();
    });
    app.get("/comments", getCommentChain);
    app.post("/comments", createComment);
    app.delete("/comments", removeComment);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns the comment chain for a listing", async () => {
    const mockComments = [{ id: "comment-1", body: "hello" }];
    getCommentChainForListing.mockResolvedValue(mockComments);

    const response = await request(app)
      .get("/comments")
      .query({ listingId: "507f1f77bcf86cd799439011" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Retrieved comment chain");
    expect(response.body.data).toEqual(mockComments);
    expect(getCommentChainForListing).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  it("creates comments using the authenticated user id", async () => {
    const mockComment = { id: "comment-2", body: "Created comment" };
    addComment.mockResolvedValue(mockComment);

    const response = await request(app).post("/comments").send({
      body: "Created comment",
      listingId: "507f1f77bcf86cd799439011",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Comment created");
    expect(response.body.data).toEqual(mockComment);
    expect(addComment).toHaveBeenCalledWith({
      body: "Created comment",
      listingId: "507f1f77bcf86cd799439011",
      authorId: "507f1f77bcf86cd799439016",
    });
  });

  it("returns service errors for deletes", async () => {
    const error = Object.assign(new Error("Forbidden"), { statusCode: 403 });
    deleteComment.mockRejectedValue(error);

    const response = await request(app).delete("/comments").send({
      commentId: "507f1f77bcf86cd799439013",
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden");
    expect(deleteComment).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439013",
      "507f1f77bcf86cd799439016"
    );
  });
});
