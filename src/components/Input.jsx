import React, { useContext } from "react";
import { SearchContext } from "../context/Context";

const Input = () => {
  const { files, setFiles } = useContext(SearchContext);
  const { cat, setCat } = useContext(SearchContext);
  const [searchInput, setSearchInput] = React.useState("");
  const [temp, setTemp] = React.useState([]);
  const [tempc, setTempc] = React.useState([]);

  React.useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products?limit=10&skip=0&select=price,title,images`
        );
        const res1 = await fetch(
          `https://dummyjson.com/products/category-list`
        );

        const data = await res.json();
        const data1 = await res1.json();

        setCat(data1);
        setTemp(data);
        setTempc(data1);
        setFiles(data.products);
        console.log(data);
        console.log(data1);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const updatefile = async (e) => {
    e.preventDefault();
    if (searchInput) {
      try {
        if (searchInput === "") {
          setFiles(temp.products);
          setCat(tempc);
        } else {
          const res = await fetch(
            `https://dummyjson.com/products/search?q=${searchInput}&limit=10&skip=0&select=price,title,images`
          );
          const res1 = await fetch(
            `https://dummyjson.com/products/search?q=${searchInput}`
          );
          const data = await res.json();
          const data1 = await res1.json();
          const categoryList = data1.products.map(
            (product) => product.category
          );
          const uniqueCategories = [...new Set(categoryList)];
          setCat(uniqueCategories);
          setFiles(data.products);
        }

        // const data = await res.json();
        // const data1 = await res1.json();
        // const categoryList = data1.products.map((product) => product.category);
        // const uniqueCategories = [...new Set(categoryList)];
        // setCat(uniqueCategories);
        // console.log(data);
        // console.log(uniqueCategories);
        // setFiles(data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setFiles(temp.products);
      setCat(tempc);
      console.log("Please enter search input");
    }
  };

  return (
    <div>
      <div className="relative w-30 sm:w-40 md:w-50 lg:w-60 text-gray-800 ">
        <form onSubmit={updatefile}>
          <label htmlFor="Search" className="sr-only">
            Search
          </label>

          <input
            type="text"
            id="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for..."
            className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="submit" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Input;
