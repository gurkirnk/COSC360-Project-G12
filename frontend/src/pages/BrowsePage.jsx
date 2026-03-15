import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { browseListings } from '../lib/api/features/browse';

//TODO: Allow parameters (genre, search), all the way to the backend
//TODO: Make search bar functional
/*TODO: Format listings/proper empty responce handling (I'll take care of this, just difficult to do when there is no way to create listings in the db)*/
export default function BrowsePage() {

  const [listings, setlistings] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  async function fetchListings() {
    console.log("fetching...");
    try {
      const response = await browseListings({ search, genre });
      setlistings(response.data || response); 
    } catch (error) {

    } finally {

    }
  }

  useEffect(() => {
    fetchListings();
  }, [search,genre]);


  return (
    <>
      <h1>Browse</h1>
      <SearchBar SearchBarClicked={(newSearch) => setSearch(newSearch)}/>
      <p>
        {listings.toString()}
      </p>
    </>
  );
}
