import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateListingPage from '../pages/CreateListingPage/CreateListingPage.jsx';
import { beforeEach, vi } from 'vitest';
import { createListing } from '../lib/api/features/list/list.js';

vi.mock('../lib/api/features/list/list.js', () => ({
    createListing: () => {}
}));


const { mocks } = vi.hoisted(() => ({
    mocks: { authenticated: true }
}));

vi.mock("../contexts/useAuth", () => ({
    useAuth: () => { return { user: { id: "a", name: "name", test: "other" }, isAuthenticated: mocks.authenticated }; }
}));

const renderPage = (user = null) => {
    return render(
        <BrowserRouter>
            <CreateListingPage />
        </BrowserRouter>
    );
};

describe('CreateListingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page with appropriate fields', async () => {
        renderPage();

        expect(await screen.findByRole('textbox', { name: "Title:" })).toHaveValue("");
        expect(await screen.findByRole('textbox', { name: "Genre:" })).toHaveValue("");
        expect(await screen.findByRole('textbox', { name: "Description:" })).toHaveValue("");
    });

     it('shows error if not logged in', async () => {
        mocks.authenticated = false
        renderPage();

        expect(await screen.findByText(/sign in/i));
    });

});