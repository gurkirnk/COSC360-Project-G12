import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LogoutPage from '../pages/LogoutPage.jsx';
import { beforeEach, vi } from 'vitest';


const { mocks } = vi.hoisted(() => ({
    mocks: { logout: () => { return true } }
}));

vi.mock("../contexts/useAuth", () => ({
    useAuth: () => { return { logout: mocks.logout } }
}));

const renderPage = (user = null) => {
    return render(
        <BrowserRouter>
            <LogoutPage />
        </BrowserRouter>
    );
};

describe('LogoutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page with appropriate fields', async () => {
        renderPage();

        expect(screen.getByRole("button"));
        expect(screen.getByText("Log Out"));
    });

    it('redirects to home page after logging out', async () => {
        renderPage();

        const button = screen.getByRole('button');
        act(() => {
            fireEvent.click(button);
        });
        expect(window.location.pathname).toBe('/');
    });

});