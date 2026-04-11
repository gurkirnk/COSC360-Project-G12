import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider} from '../contexts/AuthContext';
import HomePage from '../pages/HomePage/HomePage';
import { beforeEach, vi } from 'vitest';

vi.mock('../components/AddOne/Addone.jsx', () => ({
  default: () => <div data-testid="add-one">AddOne Component</div>
}));

const { mocks } = vi.hoisted(() => ({
  mocks: { currentRole: 'guest' }
}));


vi.mock("../components/Switchers/RoleSwitcher.jsx", () => ({
  default: ({ guestComponent, userComponent, adminComponent }) => {
    const role = mocks.currentRole;
    if (role == 'admin') return adminComponent;
    if (role == 'user') return userComponent;
    return guestComponent;
  }
}));

const renderHomePage = (user = null) => {
  return render(
    <BrowserRouter>
        <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders the homepage with title and subtitle', () => {
    mocks.currentRole = 'guest';
    renderHomePage();

    expect(screen.getByText('Book Nook')).toBeInTheDocument();
    expect(screen.getByText('COSC 360 Team 12')).toBeInTheDocument();
  });

  it('renders search form for guest users', () => {
    mocks.currentRole = 'guest';
    renderHomePage();

    expect(screen.getByPlaceholderText('Enter Search Here...')).toBeInTheDocument();
  });

  it('renders different view for admin users', () => {
    mocks.currentRole = 'admin';
    renderHomePage();

    expect(screen.getByText('Welcome, Admin')).toBeInTheDocument();
    expect(screen.queryByText('Book Nook')).not.toBeInTheDocument();
    expect(screen.getByText("Find User By Id")).toBeInTheDocument();
  });

});