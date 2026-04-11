import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider} from '../contexts/AuthContext';
import HomePage from '../pages/HomePage/HomePage';
import { vi } from 'vitest';

vi.mock('../../components/AddOne', () => ({
  default: () => <div data-testid="add-one">AddOne Component</div>
}));

vi.mock("../../components/Switchers/RoleSwitcher", () => ({
  default: ({ guestComponent, userComponent, adminComponent }) => {
    return <div data-testid="role-switcher">{guestComponent}</div>;
  }
}));

const renderHomePage = (user = null) => {
  return render(
    <BrowserRouter>
      <AuthProvider children={{ user }}>
        <HomePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  test('renders the homepage with title and subtitle', () => {
    renderHomePage();

    expect(screen.getByText('Book Nook')).toBeInTheDocument();
    expect(screen.getByText('COSC 360 Team 12')).toBeInTheDocument();
  });

  test('renders search form for guest users', () => {
    renderHomePage();

    expect(screen.getByPlaceholderText('Enter Search Here...')).toBeInTheDocument();
  });
});