import { useAuth } from "../../contexts/useAuth";
import "./Listings.css";

//For creating a visually pleasing list, takes the results of a browse query.
export default function Listings({ listings, variant  }) {
    const {user, isAuthenticated, isAdmin} = useAuth();
    if (!listings) return null;

    if (listings.results.length === 0) {
        return <p className="listings-empty">No results found.</p>;
    }

    return (
        <div className="listings-grid">
            {listings.results.map((item) => (
                <div className={variant === "full" ? "listing-full" : "listing-card"} key={item._id}>
                    <h2>
                        <a href={"/listView?id=" + item._id}>{item.title}</a>
                    </h2>
                    <p><strong>Genre:</strong> {item.genre}</p>
                    <p><strong>Format:</strong> {item.format}</p>
                    {item.description && (
                        <p className="listing-description">"{item.description}"</p>
                    )}
                    <div className="listing-meta">
                        <small>Added: {new Date(item.createdAt).toLocaleDateString()}</small>

                        <div className="listing-actions">
                            {isAuthenticated && item.userId === user?.id && (
                                <>
                                    <a href={"/listEdit?id=" + item._id}>Edit</a>
                                    <a className="action-delete" href={"/listDelete?id=" + item._id}>Delete</a>
                                </>
                            )}
                            {isAdmin && item.userId !== user?.id && (
                                <a className="action-delete" href={"/listDelete?id=" + item._id}>Delete</a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
