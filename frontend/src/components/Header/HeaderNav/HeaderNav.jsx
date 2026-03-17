import RegistrationSwitcher from '../../RegistrationSwitcher/RegistrationSwitcher';
import './HeaderNav.css';
import { NavLink } from 'react-router-dom';

export default function HeaderNav() {
  return (
    <nav className="main-navigation" aria-label="main navigation">
      <RegistrationSwitcher
        registeredComponent={
          <ul className="main-navigation-list">
            <li className="main-navigation-item"><NavLink to="/">Home</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/list">Make A Listing</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/browse">Browse</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/account">Account</NavLink></li>
          </ul>}
        unregisteredComponent={

          <ul className="main-navigation-list">
            <li className="main-navigation-item"><NavLink to="/browse">Browse</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/login">Login</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/register">Register</NavLink></li>
          </ul>
        }
      />
    </nav>
  );
}