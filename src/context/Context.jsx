// src/context/SearchContext.js
import React, { createContext, useState, useMemo } from 'react';

// Create a context
const SearchContext = createContext();


const SearchProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [cat,setCat] = useState([]);


  const value = useMemo(() => ({ files, setFiles,cat,setCat }), [files, setFiles,cat,setCat]);


  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider };
