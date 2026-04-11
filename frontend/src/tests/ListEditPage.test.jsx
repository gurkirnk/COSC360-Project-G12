import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListEditPage from '../pages/ListEditPage/ListEditPage.jsx';
import { beforeEach, vi } from 'vitest';
import { browseListingsById, editListing } from '../lib/api/features/list/list.js';


const { mocks } = vi.hoisted(() => ({
  mocks: { authenticated: true }
}));


vi.mock('../lib/api/features/list/list.js', () => ({
    editListing: vi.fn(),
    browseListingsById: vi.fn()
}));


vi.mock("../contexts/useAuth", () => ({
    useAuth: () => {return {user: {id: "a"}, isAuthenticated: mocks.authenticated};}
}));

const renderPage = (user = null) => {
  return render(
    <BrowserRouter>
        <ListEditPage />
    </BrowserRouter>
  );
};

describe('ListEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders the page with pre-filled fields', async () => {
    browseListingsById.mockResolvedValue({results: {title: "title", genre: "genre", format: "Paperback", description: "description", userId: "a"}});
    renderPage();

    expect(await screen.findByRole('textbox', { name: "Title:" })).toHaveValue('title');
    expect(await screen.findByRole('textbox', { name: "Genre:" })).toHaveValue('genre');
    expect(await screen.findByRole('textbox', { name: "Description:" })).toHaveValue('description');
  });

  it('returns loading if no listing has been found yet', async () => {
    browseListingsById.mockResolvedValue(null);
    renderPage();

    expect(await screen.getByText("Loading..."));
  });

  it('ensures user is authenticated', async () => {
    browseListingsById.mockResolvedValue({results: {title: "title", genre: "genre", format: "Paperback", description: "description", userId: "a"}});
    mocks.authenticated = false;
    renderPage();

    expect(await screen.findByText(/sign in/i));
  });

  it('ensure user is owner of listing', async () => {
    browseListingsById.mockResolvedValue({results: {title: "title", genre: "genre", format: "Paperback", description: "description", userId: "b"}});
    mocks.authenticated = true;
    renderPage();

    expect(await screen.findByText(/another user/i));
  });

});