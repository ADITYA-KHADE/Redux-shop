// src/context/SearchContext.js
import React, { createContext, useState } from 'react';

// Create a context
const SearchContext = createContext();

// Create a provider component
const SearchProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <SearchContext.Provider value={{ searchInput, setSearchInput }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider };
