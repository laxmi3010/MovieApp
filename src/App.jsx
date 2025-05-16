import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Mobileview from './components/Mobileview';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setBannerData, setimageURL } from './store/Movieoslice';

const App = () => {
  const dispatch = useDispatch();

  // Optional: set base URL globally
  // axios.defaults.baseURL = 'https://api.themoviedb.org/3'; // Uncomment if needed

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get('/trending/all/week');
      dispatch(setBannerData(response.data.results));
      // console.log('Trending Data:', response.data.results);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    }
  };

  const fetchConfiguration = async () => {
    try {
      const result = await axios.get('/configuration');
      dispatch(setimageURL(result.data.images.secure_base_url + 'original'));
      // console.log('Configuration:', result.data);
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  };

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Mobileview />
    </>
  );
};

export default App;
