import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { browseListings } from '../lib/api/features/browse';
import { useSearchParams } from "react-router-dom";

//TODO: Allow parameters (genre, search), all the way to the backend
/*TODO: Format listings/proper empty responce handling (I'll take care of this, just difficult to do when there is no way to create listings in the db)*/
export default function BrowsePage() {

  const [listings, setlistings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams(window.location.search);

  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";

  useEffect(() => {

    async function fetchListings() {
      console.log(genre);
      console.log(search);
      try {
        const response = await browseListings({ search, genre });
        setlistings(response.data || response);
      } catch (error) {

      } finally {

      }
    }

    
    fetchListings();
  }, [search, genre]);


  return (
    <>
      <h1>Browse</h1>
      <SearchBar SearchBarClicked={(newSearch) => setSearchParams({search: newSearch, genre: genre})} />
      <p>
        {JSON.stringify(listings)}
      </p>
    </>
  );
}
