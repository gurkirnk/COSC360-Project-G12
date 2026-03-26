//For creating a visually pleasing list, takes the results of a browse query.
export default function Listings({ listings }) {
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
                </div>
            ))}
            {
                listings?.results.length == 0 ? <h2>No Results Found</h2> : <></>
            }
        </div>
    );
}