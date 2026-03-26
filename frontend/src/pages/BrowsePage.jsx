import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { browseListings } from '../lib/api/features/browse';
import { useSearchParams } from "react-router-dom";

export default function BrowsePage() {

  const [listings, setlistings] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams(window.location.search);

  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await browseListings({ search, genre });
        setlistings(response.data || response);
      } catch (error) {
        console.error("Failed to load listings:", error);
      }
    }

    fetchListings();
  }, [search, genre]);


  return (
    <>
      <h1>Browse</h1>
      <SearchBar SearchBarClicked={(newSearch) => setSearchParams({search: newSearch, genre: genre})} />
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
        listings?.results.length == 0? <h2>No Results Found</h2>:<></>
      }
    </div>
    </>
  );
}
