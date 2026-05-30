import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import axios from 'axios';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [mobileInput, setMobileInput] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`search/multi`, {
        params: {
          query: location?.search?.slice(3),
          page: page
        }
      });

      setData((prev) =>
        page === 1 ? response.data.results : [...prev, ...response.data.results]
      );
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setData([]);
  }, [location?.search]);

  useEffect(() => {
    fetchData();
  }, [page, location?.search]);

  const handleScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200 &&
      page < totalPages &&
      !loading
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page, totalPages]);

  const handleMobileSearch = () => {
    if (mobileInput.trim()) {
      const params = new URLSearchParams({ q: mobileInput.trim() });
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-only Search Input */}
        <div className="block sm:hidden my-4 text-center">
          <input
            type="text"
            placeholder="Search..."
            value={mobileInput}
            onChange={(e) => setMobileInput(e.target.value)}
            className="px-4 py-2 rounded-md w-4/5 text-black"
          />
          <button
            onClick={handleMobileSearch}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Go
          </button>
        </div>

        <h3 className="capitalize text-cyan-50 text-2xl font-bold my-2 text-center">
          Search Result
        </h3>

        {loading && page === 1 ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-auto max-w-screen-sm sm:max-w-none">
              {data.map((searchData) => (
                <Card
                  data={searchData}
                  key={searchData.id + "search"}
                  media_Type={searchData.media_Type}
                />
              ))}
            </div>
          </div>
        )}

        {loading && page > 1 && (
          <p className="text-white text-center my-4">Loading more...</p>
        )}
      </div>
    </div>
  );
};

export default Search;
