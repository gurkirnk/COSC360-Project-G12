import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { apiClient } from "../../lib/api/api-client";
import NotAllowedPage from "../NotAllowedPage";
import "./AdminAnalyticsPage.css";

function formatCount(count, type) {
  const label = count === 1 ? type : `${type}s`;
  return `${count} ${label}`;
}

function renderBookLink(item) {
  const title = item.title || "Untitled listing";

  if (!item.listingId) {
    return <span className="admin-analytics-title">{title}</span>;
  }

  return (
    <Link
      className="admin-analytics-title"
      to={`/listView?id=${encodeURIComponent(item.listingId)}`}
    >
      {title}
    </Link>
  );
}

function renderList(items, countKey, type) {
  if (!items.length) {
    return <p className="admin-analytics-state">No activity yet.</p>;
  }

  return (
    <ol className="admin-analytics-list">
      {items.map((item, index) => (
        <li
          className="admin-analytics-item"
          key={`${countKey}-${item.listingId ?? index}`}
        >
          <div className="admin-analytics-item-header">
            <span className="admin-analytics-rank">#{index + 1}</span>
            <span className="admin-analytics-count">
              {formatCount(item[countKey] ?? 0, type)}
            </span>
          </div>

          {renderBookLink(item)}

          <p className="admin-analytics-meta">
            {[item.genre, item.format].filter(Boolean).join(" / ") ||
              "Listing details unavailable"}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function AdminAnalyticsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      return;
    }

    let cancelled = false;

    async function loadAnalytics() {
      try {
        setErrorMessage("");

        const response = await apiClient("/api/auth/admin/analytics", {
          method: "GET",
        });
        const results = response?.data?.results ?? response?.data ?? response;

        if (!cancelled) {
          setAnalytics({
            mostReservedBooks: results?.mostReservedBooks ?? [],
            mostCommentedBooks: results?.mostCommentedBooks ?? [],
          });
        }
      } catch (error) {
        if (!cancelled) {
          setAnalytics({
            mostReservedBooks: [],
            mostCommentedBooks: [],
          });
          setErrorMessage(error.message);
        }
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) {
    return <NotAllowedPage details="You must be logged in to view this page." />;
  }

  if (!isAdmin) {
    return <NotAllowedPage details="You must be an admin to access this page." />;
  }

  return (
    <main className="admin-analytics-page">
      <div className="admin-analytics-shell">
        <h1>Analytics</h1>
        <p className="admin-analytics-intro">
          Top 5 books by reservations and comments.
        </p>
        <Link className="admin-analytics-back" to="/admin">
          Back to admin links
        </Link>

        {errorMessage ? (
          <p className="admin-analytics-state admin-analytics-error">
            {errorMessage}
          </p>
        ) : null}

        {!analytics ? (
          <p className="admin-analytics-state">Loading analytics...</p>
        ) : (
          <div className="admin-analytics-sections">
            <section className="admin-analytics-card">
              <h2>Most Reserved Books</h2>
              {renderList(
                analytics.mostReservedBooks,
                "reservationCount",
                "reservation"
              )}
            </section>

            <section className="admin-analytics-card">
              <h2>Most Commented Books</h2>
              {renderList(
                analytics.mostCommentedBooks,
                "commentCount",
                "comment"
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
