import React from "react";

function SearchEngine({ query, setQuery, search }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search(e);
      
    }
  };

  return (
    <div className="SearchEngine">
      <input
        type="text"
        className="SearchEngine input"
        placeholder="enter city name"
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={handleKeyPress}
        aria-label="Search for a city"
      />
      <button type="submit" onClick={search}><i className="fas fa-search" style={{ fontSize: "18px" }}></i></button>
    </div>
  );
}

export default SearchEngine;