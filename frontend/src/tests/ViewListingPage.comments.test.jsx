import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ViewListingPage from "../pages/ViewListingPage/ViewListingPage";

vi.mock("../contexts/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../lib/api/features/list", () => ({
  browseListingsById: vi.fn(),
}));

vi.mock("../lib/api/features/comments", () => ({
  createComment: vi.fn(),
  deleteComment: vi.fn(),
  getCommentChainForListing: vi.fn(),
}));

vi.mock("../lib/api/features/user", () => ({
  getUserById: vi.fn(),
}));

import { useAuth } from "../contexts/useAuth";
import { browseListingsById } from "../lib/api/features/list";
import {
  createComment,
  deleteComment,
  getCommentChainForListing,
} from "../lib/api/features/comments";
import { getUserById } from "../lib/api/features/user";

const LISTING_ID = "listing-123";
const BASE_LISTING = {
  id: LISTING_ID,
  title: "Dune",
  description: "A sci-fi classic.",
  format: "Hardcover",
  genre: "Science Fiction",
  createdAt: "2026-04-11T08:30:00.000Z",
  userId: "seller-1",
};

function makeComment({
  id,
  body,
  authorId,
  replies = [],
  deletedAt = null,
}) {
  return {
    id,
    body,
    authorId,
    replies,
    deletedAt,
    createdAt: "2026-04-11T08:30:00.000Z",
  };
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[`/listing?id=${LISTING_ID}`]}>
      <ViewListingPage />
    </MemoryRouter>
  );
}

describe("ViewListingPage comment flows", () => {
  let setIntervalSpy;
  let clearIntervalSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    setIntervalSpy = vi.spyOn(window, "setInterval").mockImplementation(() => 1);
    clearIntervalSpy = vi.spyOn(window, "clearInterval").mockImplementation(() => {});

    useAuth.mockReturnValue({
      user: { id: "user-1", name: "Reader" },
      isAuthenticated: true,
    });
    browseListingsById.mockResolvedValue({ results: BASE_LISTING });
    getUserById.mockResolvedValue({ results: { name: "seller" } });
  });

  afterEach(() => {
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  it("loads comments and lets an authenticated user post a new top-level comment", async () => {
    getCommentChainForListing
      .mockResolvedValueOnce([
        makeComment({
          id: "comment-1",
          body: "First comment",
          authorId: { id: "user-2", name: "Alice" },
        }),
      ])
      .mockResolvedValueOnce([
        makeComment({
          id: "comment-1",
          body: "First comment",
          authorId: { id: "user-2", name: "Alice" },
        }),
        makeComment({
          id: "comment-2",
          body: "New comment",
          authorId: { id: "user-1", name: "Reader" },
        }),
      ]);
    createComment.mockResolvedValue({ id: "comment-2", body: "New comment" });

    renderPage();

    expect(await screen.findByText("First comment")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Write something thoughtful..."), {
      target: { value: "  New comment  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Post comment" }));

    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith({
        body: "New comment",
        listingId: LISTING_ID,
        parentCommentId: undefined,
      });
    });

    expect(await screen.findByText("Comment posted.")).toBeInTheDocument();
    expect(await screen.findByText("New comment")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Write something thoughtful...")).toHaveValue("");
  });

  it("opens a reply form and posts a reply into the selected thread", async () => {
    getCommentChainForListing
      .mockResolvedValueOnce([
        makeComment({
          id: "comment-1",
          body: "Root comment",
          authorId: { id: "user-2", name: "Alice" },
        }),
      ])
      .mockResolvedValueOnce([
        makeComment({
          id: "comment-1",
          body: "Root comment",
          authorId: { id: "user-2", name: "Alice" },
          replies: [
            makeComment({
              id: "reply-1",
              body: "Thanks for sharing",
              authorId: { id: "user-1", name: "Reader" },
            }),
          ],
        }),
      ]);
    createComment.mockResolvedValue({ id: "reply-1", body: "Thanks for sharing" });

    renderPage();

    expect(await screen.findByText("Root comment")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    fireEvent.change(screen.getByPlaceholderText("Share your thoughts..."), {
      target: { value: " Thanks for sharing " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Post reply" }));

    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith({
        body: "Thanks for sharing",
        listingId: LISTING_ID,
        parentCommentId: "comment-1",
      });
    });

    expect(await screen.findByText("Reply posted.")).toBeInTheDocument();
    expect(await screen.findByText("Thanks for sharing")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Share your thoughts...")).not.toBeInTheDocument();
    });
  });

  it("lets the author delete their own comment and refreshes the thread", async () => {
    getCommentChainForListing
      .mockResolvedValueOnce([
        makeComment({
          id: "comment-1",
          body: "My comment",
          authorId: { id: "user-1", name: "Reader" },
        }),
      ])
      .mockResolvedValueOnce([
        makeComment({
          id: "comment-1",
          body: "this comment was deleted",
          authorId: null,
          deletedAt: "2026-04-10T00:00:00.000Z",
        }),
      ]);
    deleteComment.mockResolvedValue({ id: "comment-1" });

    renderPage();

    expect(await screen.findByText("My comment")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith("comment-1");
    });

    expect(await screen.findByText("Comment deleted.")).toBeInTheDocument();
    expect(await screen.findByText("this comment was deleted")).toBeInTheDocument();
  });
});
