import "./HomePage.css";
import AddOne from "../../components/AddOne";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";



export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (searchString) => {
    navigate(`/browse?search=${encodeURIComponent(searchString)}`);
  };

  return (
    <>
      <h1 className="BigTitle">Book Borrowing Site</h1>
      <h2 className="DaSubtitle">COSC 360 Team 12</h2>
      <form className="SearchForm">
      <SearchBar SearchBarClicked={handleSearch} />
      </form>
    </>
  );
}
