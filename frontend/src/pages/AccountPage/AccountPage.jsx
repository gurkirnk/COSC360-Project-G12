import { useAuth } from "../../contexts/useAuth";
import ErrorPage from "../ErrorPage";
import NotAllowedPage from "../NotAllowedPage";
import "./AccountPage.css";

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <NotAllowedPage details="You must be logged in to view this page." />;
  }
  if (!user) {
    return <ErrorPage details="Your user data could not be loaded for some reason. Try relogging in." />;
  }
  return (
    <section className="account-page">
      <div className="account-card">
        <h1>Account</h1>

        {user.profilePictureLink ? (
          <div className="account-profile-picture">
            <img src={user.profilePictureLink} alt={`${user.name ?? "User"}'s profile picture`} />
          </div>
        ) : null}

        <dl className="account-details">
          {Object.entries(user).map(([key, value]) => (
            <div className="account-detail-row" key={key}>
              <dt>{(key)}</dt>
              <dd>{JSON.stringify(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}