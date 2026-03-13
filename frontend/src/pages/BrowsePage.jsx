import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { browseListings } from '../lib/api/features/browse';

//TODO: Allow parameters (genre, search), all the way to the backend
//TODO: Make search bar functional
/*TODO: Format listings/proper empty responce handling (I'll take care of this, just difficult to do when there is no way to create listings in the db)*/
export default function BrowsePage() {

  const [listings, setlistings] = useState([]);
  let search = "";
  let genre = "";

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
  }, []);

  return (
    <>
      <h1>Browse</h1>
      <SearchBar />
      <p>
        {listings.toString()}
      </p>
    </>
  );
}
