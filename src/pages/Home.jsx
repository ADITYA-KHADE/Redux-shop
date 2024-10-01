import { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner";
import Product from "../components/Product";
import { SearchContext } from "../context/Context";

const Home = () => {
  const { files, cat } = useContext(SearchContext);
  const API_URL = "https://dummyjson.com/products";
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const limit = 10;

  const updatedpost = () => {
    setPosts(files);
    setCategories(cat);
    setSelectedCategory("");
    console.log(files);
    console.log(cat);
  };

  const fetchPendingFiles = async (page, selectedCategory) => {
    const offset = (page - 1) * limit;
    setLoading(true);
    try {
      if(selectedCategory){
        const res = await fetch(
          `${API_URL}/category/${selectedCategory}?limit=${limit}&skip=${offset}&select=price,title,images`
        );
        const data = await res.json();
        setPosts(data.products);
        setTotalFiles(data.total);
      }else{
        setPosts(files);
        setTotalFiles(files.total);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      updatedpost();
    }
  }, [files, cat]);

  useEffect(() => {
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
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (currentPage > 1) pages.push(currentPage - 1);
    pages.push(currentPage);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    return pages;
  };

  return (
    <div>
      <div className="my-4">
        <select
          onChange={(e) => handleCategoryChange(e.target.value)}
          value={selectedCategory}
          className="p-2 border rounded"
        >
          <option
            value=""
          >
            All Categories
          </option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
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
