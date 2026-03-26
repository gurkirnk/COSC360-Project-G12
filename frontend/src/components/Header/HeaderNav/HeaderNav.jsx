import {AuthenticatedSwitcher} from '../../Switchers';
import './HeaderNav.css';
import { NavLink } from 'react-router-dom';

export default function HeaderNav() {

  return (
    <nav className="main-navigation" aria-label="main navigation">
      <AuthenticatedSwitcher
        authenticatedComponent={
          <ul className="main-navigation-list">
            <li className="main-navigation-item"><NavLink to="/">Home</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/list">Make A Listing</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/browse">Browse</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/profile">Profile</NavLink></li>
            <li className="main-navigation-item"><NavLink to="/logout">Logout</NavLink></li>
          </ul>}
        unauthenticatedComponent={
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
