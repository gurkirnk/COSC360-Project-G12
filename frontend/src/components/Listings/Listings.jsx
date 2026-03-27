import { useAuth } from "../../contexts/useAuth";

//For creating a visually pleasing list, takes the results of a browse query.
export default function Listings({ listings }) {
    const {user, isAuthenticated} = useAuth();
    return (
        <div>
            {listings?.results.map((item) => (
                <div class="listing" key={item._id}>
                    <h2>{item.title}</h2>
                    <p><strong>Genre:</strong> {item.genre}</p>
                    <p><strong>Format:</strong> {item.format}</p>
                    <p>"{item.description}"</p>
                    <small>
                        Added: {new Date(item.createdAt).toLocaleDateString()}
                    </small>
                    <p>{(isAuthenticated && item.userId == user?._id)?<><a href={"/listEdit?id="+item._id}>Edit Listing</a> |  <a href="/listDelete">Delete Listing</a></>:<></> }</p>
                </div>
            ))}
            {
                listings?.results.length == 0 ? <h2>No Results Found</h2> : <></>
            }
        </div>
    );
}