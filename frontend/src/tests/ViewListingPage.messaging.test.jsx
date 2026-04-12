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

vi.mock("../lib/api/features/messages", () => ({
  createConversation: vi.fn(),
}));

import { useAuth } from "../contexts/useAuth";
import { browseListingsById } from "../lib/api/features/list";
import { getCommentChainForListing } from "../lib/api/features/comments";
import { getUserById } from "../lib/api/features/user";
import { createConversation } from "../lib/api/features/messages";

const LISTING_ID = "listing-123";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[`/listView?id=${LISTING_ID}`]}>
      <ViewListingPage />
    </MemoryRouter>
  );
}

describe("ViewListingPage messaging CTA", () => {
  let setIntervalSpy;
  let clearIntervalSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    setIntervalSpy = vi.spyOn(window, "setInterval").mockImplementation(() => 1);
    clearIntervalSpy = vi.spyOn(window, "clearInterval").mockImplementation(() => {});
    useAuth.mockReturnValue({
      user: { id: "reader-1", name: "Reader" },
      isAuthenticated: true,
    });
    browseListingsById.mockResolvedValue({
      results: {
        id: LISTING_ID,
        title: "Dune",
        description: "A sci-fi classic.",
        format: "Hardcover",
        genre: "Science Fiction",
        createdAt: "2026-04-11T08:30:00.000Z",
        userId: "seller-1",
      },
    });
    getUserById.mockResolvedValue({ results: { name: "seller" } });
    getCommentChainForListing.mockResolvedValue([]);
  });

  afterEach(() => {
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  it("starts or reuses a conversation from the listing page", async () => {
    createConversation.mockResolvedValue({
      id: "conversation-1",
    });

    renderPage();

    const button = await screen.findByRole("button", {
      name: "Message to reserve book",
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(createConversation).toHaveBeenCalledWith({
        listingId: LISTING_ID,
      });
    });
  });

  it("keeps the reserve CTA available because listing data does not track reservations", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: "Message to reserve book",
      })
    ).toBeEnabled();
  });
});
