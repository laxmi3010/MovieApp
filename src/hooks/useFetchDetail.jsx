// src/hooks/useFetchDetail.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchDetail = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiKey = 'YOUR_TMDB_API_KEY'; // Replace this with your real key
      const baseUrl = 'https://api.themoviedb.org/3';
      const response = await axios.get(`${baseUrl}${endpoint}?api_key=${apiKey}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading };
};

export default useFetchDetail;
