import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { browseListings } from '../lib/api/features/browse';
import { useSearchParams } from "react-router-dom";
import Listings from '../components/Listings';

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
      <Listings listings = {listings} />
    </>
  );
}
