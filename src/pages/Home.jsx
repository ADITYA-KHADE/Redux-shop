import { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner";
import Product from "../components/Product";
import { SearchContext } from "../context/Context";

const Home = () => {
  const { searchInput } = useContext(SearchContext);
  const [products, setProducts] = useState([]);
  const API_URL = "https://dummyjson.com/products";
  const CATEGORY_URL = "https://dummyjson.com/products/categories";
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const limit = 10;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        searchInput === "" ? CATEGORY_URL : `${API_URL}/search?q=${searchInput}`
        // https://dummyjson.com/products/search?q=phone&select=category
      );
      const data = await res.json();
      console.log(data)
      if (searchInput === "") {
        

        const categories = data.map((product) => product.category);

        const uniqueCategories = [...new Set(categories)];
        console.log(uniqueCategories);

        setCategories(uniqueCategories);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPendingFiles = async (page, selectedCategory) => {
    const offset = (page - 1) * limit;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}${
          selectedCategory ? `/category/${selectedCategory}` : ""
        }?limit=${limit}&skip=${offset}&select=price,title,images`
      );
      const data = await res.json();
      setPosts(data.products);
      setTotalFiles(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPendingFiles(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const totalPages = Math.ceil(totalFiles / limit);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to the first page when category changes
  };

  const getPageNumbers = () => {
    const pages = [];
    if (currentPage > 1) pages.push(currentPage - 1);
    pages.push(currentPage);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    return pages;
  };

  console.log(categories);

  return (
    <div>
      {/* Category Dropdown */}
      <div className="my-4">
        <select
          onChange={(e) => handleCategoryChange(e.target.value)}
          value={selectedCategory}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : posts.length > 0 ? (
        <div>
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]">
            {posts.map((post) => (
              <Product key={post.id} post={post} />
            ))}
          </div>
          <ol className="flex justify-center gap-2 text-xs font-medium mt-4">
            {currentPage > 1 && (
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                >
                  <span className="sr-only">Prev Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            )}

            {getPageNumbers().map((page, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`block size-8 rounded border border-gray-100 text-center leading-8 ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            {currentPage < totalPages && (
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                >
                  <span className="sr-only">Next Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            )}
          </ol>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
