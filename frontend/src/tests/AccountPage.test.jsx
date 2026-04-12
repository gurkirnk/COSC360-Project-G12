import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx";
import { browseListingsById, browseListingsByUserId } from "../lib/api/features/list/list.js";
import { getUserReservations } from "../lib/api/features/reservations";

const { mocks } = vi.hoisted(() => ({
  mocks: { authenticated: true },
}));

vi.mock("../lib/api/features/list/list.js", () => ({
  browseListingsByUserId: vi.fn(),
  browseListingsById: vi.fn(),
}));

vi.mock("../lib/api/features/reservations", () => ({
  getUserReservations: vi.fn(),
}));

vi.mock("../contexts/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "name", test: "other" },
    isAuthenticated: mocks.authenticated,
  }),
}));

function renderPage() {
  return render(
    <BrowserRouter>
      <ProfilePage />
    </BrowserRouter>
  );
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authenticated = true;
    browseListingsByUserId.mockResolvedValue({
      results: [
        {
          _id: "listing-1",
          title: "Owned Listing",
          genre: "Fantasy",
          format: "Paperback",
          description: "Owned description",
          userId: "user-1",
          createdAt: "2026-04-11T08:00:00.000Z",
        },
      ],
    });
    getUserReservations.mockResolvedValue({
      results: [{ id: "reservation-1", listingId: "listing-2" }],
    });
    browseListingsById.mockResolvedValue({
      results: {
        _id: "listing-2",
        title: "Reserved Listing",
        genre: "Sci-Fi",
        format: "Hardcover",
        description: "Reserved description",
        userId: "owner-2",
        createdAt: "2026-04-10T08:00:00.000Z",
      },
    });
  });

  it("renders the page with user details, listings, and reservations", async () => {
    renderPage();

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(await screen.findByText("Owned Listing")).toBeInTheDocument();
    expect(await screen.findByText("Reserved Listing")).toBeInTheDocument();
    expect(screen.getByText("Your Listings")).toBeInTheDocument();
    expect(screen.getByText("Your Reservations")).toBeInTheDocument();
  });

  it("ensures user is authenticated", async () => {
    mocks.authenticated = false;
    renderPage();

    expect(await screen.findByText(/must be logged in/i)).toBeInTheDocument();
  });
});
