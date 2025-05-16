import React, { useEffect, useState } from 'react';
import Bannerhome from '../components/Bannerhome';
import Horizontalscrollcard from '../components/Horizontalscrollcard';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import useFetch from '../hooks/Usefetch'
import Footer from '../components/Footer';

const Home = () => {
  const dispatch = useDispatch();
  const trendingData = useSelector(state => state.movieoData.bannerData);
  const {data : nowPlayingData} = useFetch('/movie/now_playing')
  const {data : topRatedData} = useFetch('/movie/top_rated')
  const {data : popularTvShowData} = useFetch('/tv/popular')
  const {data : onAir} = useFetch('/tv/on_the_air')


  useEffect(() => {
    const fetchNowplayingData = async () => {
      try {
        const response = await axios.get('');
        setNowPlayingData(response.data.results);
        console.log('Now Playing:', response.data.results);
      } catch (error) {
        console.error('Error fetching now playing data:', error);
      }
    };

   

    fetchNowplayingData();
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('/trending/all/week?language=en-US');
        dispatch({ type: 'movieoData/setBannerData', payload: res.data.results });
        console.log('Fetched trending:', res.data.results);
      } catch (err) {
        console.error('Error fetching trending data', err);
      }
    };

    fetchTrending();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black">
      <Bannerhome />

      <Horizontalscrollcard
        data={trendingData}
        heading="Trending"
        trending={true}
      />

      <Horizontalscrollcard
        data={nowPlayingData}
        heading="Now Playing"
        media_Type= {'movie'}
      />

      <Horizontalscrollcard
        data={topRatedData}
        heading="Top Rated Movie"
        media_Type= {'movie'}
      />

      <Horizontalscrollcard
        data={popularTvShowData}
        heading="Popular TV Shows"
        media_Type= {'tv'}
      />

<Horizontalscrollcard
        data={onAir}
        heading="On Air"
        media_Type= {'tv'}
      />
    </div>
  );
};

export default Home;
