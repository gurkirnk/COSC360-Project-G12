import './SearchBar.css';
import { useState } from 'react';

export default function SearchBar({ SearchBarClicked }) {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    // Pass the current input value back to the parent
    SearchBarClicked(inputValue);
    setInputValue("");
  };


  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search for a book..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button className="search-button" type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}