// layouts/MainLayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Mobileview from "../components/Mobileview";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBannerData, setimageURL } from "../store/Movieoslice";

const MainLayout = () => {
  const dispatch = useDispatch();

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get("/trending/all/week");
      dispatch(setBannerData(response.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConfiguration = async () => {
    try {
      const result = await axios.get("/configuration");
      dispatch(
        setimageURL(result.data.images.secure_base_url + "original")
      );
    } catch (error) {
      console.error(error);
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

export default MainLayout;
