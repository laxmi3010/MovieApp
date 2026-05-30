import React, { useEffect, useState } from "react";
import Horizontalscrollcard from "../components/Horizontalscrollcard";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import API_URL from "../config/api";


const WatchTogether = () => {
  const [groupWatchList, setGroupWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMoviesData, setUserMoviesData] = useState({});

  useEffect(() => {
    const fetchWatchTogetherList = async () => {
      console.log(`Group watch movie data fetching started`);
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/watch-together-list`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        // Check if error response
        if (data.success === false) {
          toast.error(data.message || "Failed to fetch watch together list");
          setLoading(false);
          return;
        }

        const { group_watch_list } = data;

        console.log(`group watch list`);
        console.log(group_watch_list);

        if (!group_watch_list || group_watch_list.length === 0) {
          setGroupWatchList([]);
          setLoading(false);
          return;
        }

        // Filter out users with empty movie lists
        const usersWithMovies = group_watch_list.filter(
          (user) => user.user_movie_list && user.user_movie_list.length > 0,
        );

        setGroupWatchList(usersWithMovies);

        // Fetch detailed data for all users' movies in parallel
        const userMoviesPromises = usersWithMovies.map(async (user) => {
          const detailPromises = user.user_movie_list.map(async (movie) => {
            try {
              const apiKey = import.meta.env.VITE_TMDB_API_KEY;
              const baseUrl = "https://api.themoviedb.org/3";
              const endpoint = `/${movie.explore}/${movie.explore_id}`;
              const res = await fetch(
                `${baseUrl}${endpoint}?api_key=${apiKey}`,
              );
              const movieDetail = await res.json();

              // Add media_type if not present
              if (!movieDetail.media_type) {
                console.log(movieDetail);
                return {
                  ...movieDetail,
                  media_type: movie.explore,
                };
              }
              console.log(movieDetail);

              return movieDetail;
            } catch (error) {
              console.error(
                `Error fetching detail for ${movie.explore_id}:`,
                error,
              );
              return null;
            }
          });

          const allDetails = await Promise.all(detailPromises);
          // Filter out any null values from failed requests
          return {
            username: user.username,
            movies: allDetails.filter((detail) => detail !== null),
          };
        });

        const allUsersMovies = await Promise.all(userMoviesPromises);

        // Create a map of username to movies
        const moviesMap = {};
        allUsersMovies.forEach((userMovies) => {
          moviesMap[userMovies.username] = userMovies.movies;
        });

        setUserMoviesData(moviesMap);
        console.log(`User Movie Data`);
        console.log(userMoviesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching watch together list:", error);
        setLoading(false);
        toast.error("Failed to fetch watch together list");
      }
    };

    fetchWatchTogetherList();
  }, []);

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen mt-16 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AiOutlineLoading3Quarters className="text-white text-6xl animate-spin" />
          <p className="text-white text-xl">Loading watch together list...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (groupWatchList.length === 0) {
    return (
      <div className="min-h-screen mt-16 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl font-semibold">
            No movie data added to spotlight
          </p>
          <p className="text-gray-400 text-lg mt-2">
            Start adding movies to your watch together list!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-black">
      <div className="pt-8 pb-4 px-6">
        <h1 className="text-white text-3xl font-semibold text-center">
          See what everyone's adding to Spotlight
        </h1>
      </div>
      {groupWatchList.map((user) => (
        <div key={user.username}>
          <Horizontalscrollcard
            data={userMoviesData[user.username] || []}
            heading={user.username.toUpperCase()}
            navigationState={{
              from: "watchTogether",
              username: user.username,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default WatchTogether;
