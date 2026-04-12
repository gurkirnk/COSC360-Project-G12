import { useEffect, useState } from "react";
import Listings from "../../components/Listings";
import { useAuth } from "../../contexts/useAuth";
import { browseListingsById, browseListingsByUserId } from "../../lib/api/features/list/list";
import { getUserReservations } from "../../lib/api/features/reservations";
import ErrorPage from "../ErrorPage";
import NotAllowedPage from "../NotAllowedPage";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [ownedListings, setOwnedListings] = useState(null);
  const [reservedListings, setReservedListings] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setOwnedListings(null);
      setReservedListings(null);
      setLoadError("");
      return;
    }

    let isCancelled = false;

    async function loadProfileCollections() {
      setOwnedListings(null);
      setReservedListings(null);
      setLoadError("");

      try {
        const [listingsResponse, reservationsResponse] = await Promise.all([
          browseListingsByUserId(user.id),
          getUserReservations(),
        ]);

        const reservationListings = await Promise.all(
          (reservationsResponse?.results ?? []).map(async (reservation) => {
            const listingId = reservation?.listingId;

            if (!listingId) {
              return null;
            }

            try {
              const listingResponse = await browseListingsById(listingId);
              const listing = listingResponse?.results ?? listingResponse;

              return listing
                ? {
                    ...listing,
                    cardKey: reservation.id ?? `${listingId}-${reservation.createdAt ?? "reservation"}`,
                  }
                : null;
            } catch (error) {
              console.error("Failed to load reserved listing:", error);
              return null;
            }
          })
        );

        if (isCancelled) {
          return;
        }

        setOwnedListings({
          results: listingsResponse?.results ?? [],
        });
        setReservedListings({
          results: reservationListings.filter(Boolean),
        });
      } catch (error) {
        console.error("Failed to load profile collections:", error);

        if (!isCancelled) {
          setLoadError("We couldn't load your listings and reservations right now.");
          setOwnedListings({ results: [] });
          setReservedListings({ results: [] });
        }
      }
    }

    loadProfileCollections();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return <NotAllowedPage details="You must be logged in to view this page." />;
  }
  if (!user) {
    return <ErrorPage details="Your user data could not be loaded for some reason. Try relogging in." />;
  }
  return (
    <section className="profile-page">
      <div className="profile-card">
        <div >
          <div className="profile-card-header">
            <h1>Profile</h1>
            <a className="profile-edit-link" href="/profile/edit">Edit Profile</a>
          </div>

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

            <div className="profile-section-header">
              <h2>Your Listings</h2>
            </div>
            {ownedListings ? <Listings listings={ownedListings} /> : null}


            <div className="profile-section-header">
              <h2>Your Reservations</h2>
            </div>
            {reservedListings ? <Listings listings={reservedListings} /> : null}


          {loadError ? <p className="profile-collection-error">{loadError}</p> : null}
          </div>
    </section>
  );
}
