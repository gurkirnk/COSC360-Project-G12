import './SearchBar.css';

export default function SearchBar() {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search for a book..."
      />
      <button className="search-button" type="button">
        Search
      </button>
    </div>
  );
}