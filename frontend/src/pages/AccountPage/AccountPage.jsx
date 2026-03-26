
import { useAuth } from "../../contexts/useAuth";
import ErrorPage from "../ErrorPage";
import NotAllowedPage from "../NotAllowedPage";
import "./AccountPage.css";

// Renamed AccountPage to ProfilePage

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <NotAllowedPage details="You must be logged in to view this page." />;
  }
  if (!user) {
    return <ErrorPage details="Your user data could not be loaded for some reason. Try relogging in." />;
  }
  return (
    <section className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>

        {user.profilePictureLink ? (
          <div className="profile-profile-picture">
            <img src={user.profilePictureLink} alt={`${user.name ?? "User"}'s profile picture`} />
          </div>
        ) : null}

        <dl className="profile-details">
          {Object.entries(user).map(([key, value]) => (
            <div className="profile-detail-row" key={key}>
              <dt>{key}</dt>
              <dd>{JSON.stringify(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}