import React, { useEffect, useState } from 'react'
import axios from 'axios'; // You forgot this import

const UseFetch = (endpoint) => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(false); // Should be boolean, not []

  const fetchData = async () => {
    try {
      setloading(true);
      const response = await axios.get(endpoint);
      setdata(response.data.results);
      console.log('Now Playing:', response.data.results);
    } catch (error) {
      console.error('Error fetching now playing data:', error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading };
};

export default UseFetch;
