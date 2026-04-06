import "./HomePage.css";
import AddOne from "../../components/AddOne";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import RoleSwitcher from "../../components/Switchers/RoleSwitcher";



export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (searchString) => {
    navigate(`/browse?search=${encodeURIComponent(searchString)}`);
  };

  const handleUserDelete = (id) => {
    navigate(`/admin/user?id=${encodeURIComponent(id)}`);
  }

  const handleListingDelete = (id) => {
    navigate(`/admin/listing?id=${encodeURIComponent(id)}`);
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
        <form className="DeleteUserForm">
          <label for="userId">Find User By Id</label>
          <SearchBar id="userId" SearchBarClicked={handleUserDelete} />
        </form>
        <form className="DeleteListingForm">
          <label for="listingId">Find Listing By Id</label>
          <SearchBar if="listingId" SearchBarClicked={handleListingDelete} />
        </form>
      </>}
    />
  );
}
