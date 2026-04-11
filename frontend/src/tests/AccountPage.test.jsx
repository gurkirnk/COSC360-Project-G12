import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage/ProfilePage.jsx';
import { beforeEach, vi } from 'vitest';
import { browseListingsById, editListing } from '../lib/api/features/list/list.js';


const { mocks } = vi.hoisted(() => ({
    mocks: { authenticated: true }
}));

vi.mock("../contexts/useAuth", () => ({
    useAuth: () => { return { user: { id: "a", name: "name", test: "other" }, isAuthenticated: mocks.authenticated }; }
}));

const renderPage = (user = null) => {
    return render(
        <BrowserRouter>
            <ProfilePage />
        </BrowserRouter>
    );
};

describe('ListEditPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page with appropriate values', async () => {
        renderPage();

        expect(screen.getByText("name"));
        expect(screen.getByText("test"));
    });

    it('ensures user is authenticated', async () => {
        mocks.authenticated = false;
        renderPage();

        expect(await screen.findByText(/must be logged in/i));
    });

});