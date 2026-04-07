import "./HomePage.css";
import AddOne from "../../components/AddOne";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import RoleSwitcher from "../../components/Switchers/RoleSwitcher";
import { useState } from "react";



export default function HomePage() {
  const navigate = useNavigate();
  const [userIdError, setUserIdError] = useState("");
  const [listingIdError, setListingIdError] = useState("");

  const handleSearch = (searchString) => {
    navigate(`/browse?search=${encodeURIComponent(searchString)}`);
  };
  const handleNameSearch = (searchString) => {
    navigate(`/user?type=name&search=${encodeURIComponent(searchString)}`);
  };
  const handleEmailSearch = (searchString) => {
    navigate(`/user?type=email&search=${encodeURIComponent(searchString)}`);
  };

  const handleUserDelete = (id) => {
    if (id.length == 24) {
      navigate(`/user?search=${encodeURIComponent(id)}`);
    } else {
      setUserIdError("Ids must be 24 characters long");
    }
  }

  const handleListingDelete = (id) => {
    if (id.length == 24) {
      navigate(`/listView?id=${encodeURIComponent(id)}`);
    } else {
      setListingIdError("Ids must be 24 characters long");
    }
  }

  return (
    <RoleSwitcher
      guestComponent={<>
        <h1 className="BigTitle">Book Borrowing Site</h1>
        <h2 className="DaSubtitle">COSC 360 Team 12</h2>
        <form className="SearchForm">
          <SearchBar SearchBarClicked={handleSearch} />
        </form>
      </>}
      userComponent={<>
        <h1 className="BigTitle">Book Borrowing Site</h1>
        <h2 className="DaSubtitle">COSC 360 Team 12</h2>
        <form className="SearchForm">
          <SearchBar SearchBarClicked={handleSearch} />
        </form>
      </>}
      adminComponent={<>
        <h1 className="BigTitle">Welcome, Admin</h1>
        <form className="SearchForm">
          <label for="listingName">Search Listings By Name</label>
          <SearchBar id="listingName" SearchBarClicked={handleSearch} />
        </form>
        <form className="SearchForm">
          <label for="userId">Find User By Id</label>
          <SearchBar id="userId" SearchBarClicked={handleUserDelete} />
          <p>{userIdError}</p>
        </form>
        <form className="SearchForm">
          <label for="listingId">Find Listing By Id</label>
          <SearchBar if="listingId" SearchBarClicked={handleListingDelete} />
          <p>{listingIdError}</p>
        </form>
        <form className="SearchForm">
          <label for="listingName">Search Users By Name</label>
          <SearchBar id="listingName" SearchBarClicked={handleNameSearch} />
        </form>
        <form className="SearchForm">
          <label for="listingName">Search Users By Email</label>
          <SearchBar id="listingName" SearchBarClicked={handleEmailSearch} />
        </form>
      </>}
    />
  );
}
