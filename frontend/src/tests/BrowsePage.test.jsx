import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BrowsePage from '../pages/BrowsePage.jsx';
import { beforeEach, vi } from 'vitest';
import { browseListings } from '../lib/api/features/list/list.js';


const { mocks } = vi.hoisted(() => ({
  mocks: { authenticated: true }
}));


vi.mock('../lib/api/features/list/list.js', () => ({
    browseListings: vi.fn()
}));


vi.mock("../contexts/useAuth", () => ({
    useAuth: () => {return {user: {id: "a"}, isAuthenticated: mocks.authenticated};}
}));

const renderPage = (user = null) => {
  return render(
    <BrowserRouter>
        <BrowsePage />
    </BrowserRouter>
  );
};

describe('ListEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders the page with correct fields', async () => {
    browseListings.mockResolvedValue({results: [{title: "title", genre: "genre", format: "Paperback", description: "description", userId: "a"}]});
    renderPage();

    expect(await screen.findByText('title'));
    expect(await screen.findByText('genre'));
    expect(await screen.findByText('Paperback'));
  });

});