import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MessagesPage from "../pages/MessagesPage/MessagesPage";

vi.mock("../contexts/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../lib/api/features/messages", () => ({
  getConversation: vi.fn(),
  getConversations: vi.fn(),
  sendMessage: vi.fn(),
}));

vi.mock("../lib/api/features/reservations", () => ({
  createReservation: vi.fn(),
}));

import { useAuth } from "../contexts/useAuth";
import { getConversation, getConversations, sendMessage } from "../lib/api/features/messages";
import { createReservation } from "../lib/api/features/reservations";

function renderPage(initialEntry = "/messages/conversation-1") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:conversationId" element={<MessagesPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("MessagesPage", () => {
  let setIntervalSpy;
  let clearIntervalSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    setIntervalSpy = vi.spyOn(window, "setInterval").mockImplementation(() => 1);
    clearIntervalSpy = vi.spyOn(window, "clearInterval").mockImplementation(() => {});

    useAuth.mockReturnValue({
      user: { id: "owner-1", name: "Owner" },
      isAuthenticated: true,
    });

    getConversations.mockResolvedValue([
      {
        id: "conversation-1",
        ownerUserId: "owner-1",
        participantUserId: "reader-1",
        ownerUser: { id: "owner-1", name: "Owner" },
        participantUser: { id: "reader-1", name: "Reader" },
        listing: {
          id: "listing-1",
          title: "Dune",
        },
        createdAt: "2026-04-11T08:00:00.000Z",
        updatedAt: "2026-04-11T08:30:00.000Z",
        lastMessageAt: "2026-04-11T08:30:00.000Z",
      },
    ]);

    getConversation.mockResolvedValue({
      conversation: {
        id: "conversation-1",
        ownerUserId: "owner-1",
        participantUserId: "reader-1",
        ownerUser: { id: "owner-1", name: "Owner" },
        participantUser: { id: "reader-1", name: "Reader" },
        listing: {
          id: "listing-1",
          title: "Dune",
          description: "A sci-fi classic.",
          format: "Hardcover",
          genre: "Science Fiction",
          availabilityStatus: "available",
        },
      },
      messages: [
        {
          id: "message-1",
          senderId: "reader-1",
          body: "Is this still available?",
          createdAt: "2026-04-11T08:30:00.000Z",
        },
      ],
      reservation: null,
    });
  });

  afterEach(() => {
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  it("sends a new chat message", async () => {
    sendMessage.mockResolvedValue({ id: "message-2" });

    renderPage();

    expect(await screen.findByText("Is this still available?")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Send a message"), {
      target: { value: " Yes, I can pick it up tomorrow. " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith("conversation-1", {
        body: "Yes, I can pick it up tomorrow.",
      });
    });
  });

  it("shows an inbox when no conversation id is provided", async () => {
    renderPage("/messages");

    expect(await screen.findByText("All of your listing conversations in one place.")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: /Dune/i })).toBeInTheDocument();
    expect(getConversations).toHaveBeenCalled();
    expect(getConversation).not.toHaveBeenCalled();
  });

  it("lets the owner assign the listing from the conversation UI", async () => {
    createReservation.mockResolvedValue({ id: "reservation-1" });

    renderPage();

    expect(await screen.findByRole("button", { name: "Assign book" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "21" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Assign book" }));

    await waitFor(() => {
      expect(createReservation).toHaveBeenCalledWith({
        listingId: "listing-1",
        borrowerUserId: "reader-1",
        conversationId: "conversation-1",
        durationDays: 21,
      });
    });
  });
});
