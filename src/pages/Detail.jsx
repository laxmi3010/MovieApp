import React, { useRef, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import { useSelector } from "react-redux";
import Horizontalscrollcard from "../components/Horizontalscrollcard";
import Videoplay from "../components/Videoplay";
import MovieAIModal from "../components/MovieAIModal";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../config/api";
import WatchPartyModal from "../components/WatchPartyModal";

const Detail = () => {
  const params = useParams();
  const imageURL = useSelector((state) => state.movieoData.imageURL);
  const location = useLocation();
  const hasUpdatedScore = useRef(false);

  console.log(`Image url ${imageURL}`);
  console.log(`Param Explore : ${params.explore} and ID ${params.id}`);

  const { data } = useFetchDetail(`/${params?.explore}/${params?.id}`);
  console.log("Movie data:", data);

  const { data: castData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/credits`,
  );
  const { data: similarData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/similar`,
  );
  const { data: recomendatitionData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/recommendations`,
  );

  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoData, setPlayVideoData] = useState(null);

  // this is for ai analyze modal opening useState hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // Check if user is premium member
  const checkPremiumAccess = () => {
    const isPremium = sessionStorage.getItem("premium_member");

    if (isPremium !== "true") {
      toast.error("Premium membership is required", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return false;
    }
    return true;
  };

  

  const handlePlayVideo = (movieOrShowData) => {
    if (!checkPremiumAccess()) {
      return; // Block action if not premium
    }
    console.log(`Play Now button action`);
    console.log(movieOrShowData);

    addThisMovieToWatched().catch((err) => {
      console.error("Backend call failed", err);
    });

    setPlayVideoData(movieOrShowData); // full data object
    setPlayVideo(true);
  };

  const writer = castData?.crew
    ?.filter(
      (el) =>
        el?.job?.toLowerCase().includes("writer") ||
        el?.job === "Screenplay" ||
        el?.job === "Story",
    )
    ?.map((el) => el?.name)
    .join(", ");

  const director = castData?.crew?.find((el) => el.job === "Director")?.name;

  // 🔹 ALL hooks first
  useEffect(() => {
    console.log(`Inside use effect`);
    if (hasUpdatedScore.current) return;
    if (location.state?.from !== "watchTogether") return;
    if (!location.state?.username) return;

    hasUpdatedScore.current = true;

    console.log(`Username from Group Watch Route ${location.state.username}`);

    fetch(`${API_URL}/update-score`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: location.state.username,
        score: 10,
      }),
    });
  }, []);

  if (!data || !castData) {
    return <div className="text-white p-8">Loading...</div>;
  }

  // below additions for adding ai analyze button feature
  const movieName =
    data.original_title ?? data.title ?? data.name ?? data.original_name;
  const releaseDate =
    data.release_date ?? data.last_air_date ?? data.first_air_date;

  console.log(`Movie Name : ${movieName}`);
  console.log(`Release date : ${releaseDate}`);

  const handleAIAnalyze = () => {
    if (!checkPremiumAccess()) {
      return; // Block action if not premium
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addThisMovieToWatched = async () => {
    if (!checkPremiumAccess()) {
      return; // Block action if not premium
    }
    console.log(`Method here to add movie to watched history`);
    const response = await fetch(`${API_URL}/watched`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        explore: params.explore,
        id: params.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    console.log(`Response from backend ${response}`);
  };

  const addMovieToGroupWatch = async () => {
    if (!checkPremiumAccess()) {
      return; // Block action if not premium
    }
    console.log(`Adding Movie to Group Watch Function`);
    try {
      const response = await fetch(`${API_URL}/watch-together`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          explore: params.explore,
          id: params.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(`Error occured while adding media group watch ${error}`);
      toast.error("Failed to add movie to group watch. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:h-screen max-w-screen-xl mx-auto">
        {/* Left - Image and Play Button */}
        <div className="w-full md:w-1/2 flex flex-col justify-start items-center p-4">
          <img
            src={imageURL + (data?.backdrop_path || data?.poster_path)}
            alt="Backdrop"
            className="w-full h-[50vh] md:w-[120%] md:h-[80vh] object-cover rounded"
          />
          <button
            onClick={() => handlePlayVideo(data)}
            className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded shadow-md 
              hover:bg-red-600 hover:text-white hover:scale-105 transition-all"
          >
            ▶ Play Now
          </button>
        </div>

        {/* Right - Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left p-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {data.title || data.name}
          </h2>
          <div className="flex flex-wrap items-start gap-3 my-3 text-sm md:text-base">
            <h2>Rating: {data.vote_average}</h2>
            <p>|</p>
            <h2>View: {data.vote_count}</h2>
            <p>|</p>
            <h2>Duration: {(Number(data.runtime) / 60).toFixed(1)} Hours</h2>
            <p>|</p>
            <h2>Release Date: {releaseDate}</h2>
          </div>
          <div className="my-3">
            <p className="text-gray-300 font-semibold md:text-base text-xl">
              Overview: {data.overview}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap text-sm md:text-base">
            <h2>Status: {data.status}</h2>
            <span>|</span>
            <h2>Release Date: {releaseDate}</h2>
            <span>|</span>
            <h2>Revenue: {data.revenue}</h2>
          </div>
          <button
            onClick={handleAIAnalyze}
            className="
            mt-3
            px-6 py-3
            rounded-lg
            bg-cyan-400
            border border-cyan-400
            text-black
            font-semibold
            tracking-wide
            shadow-md shadow-cyan-400/40
            transition-all duration-300 ease-in-out

            hover:bg-cyan-300
            hover:shadow-cyan-400/60

            focus:outline-none
            focus:ring-2 focus:ring-cyan-400
            
          "
          >
            AI Analyzer
          </button>
          <br />
          <button
            onClick={addMovieToGroupWatch}
            className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white
                    border border-neutral-700
                    transition-all duration-300 ease-out
                    hover:bg-neutral-800 hover:border-red-500 hover:text-red-400
                    hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <HiOutlineVideoCamera className="h-5 w-5" />
            Add to Spotlight
          </button>
          <br />
          <div className="mt-2">
            <WatchPartyModal
              movieId={params?.id}
              mediaType={params?.explore}
            />
          </div>
        </div>
      </div>

      {/* Crew Section */}
      <div className="p-4 max-w-screen-xl mx-auto">
        <h2 className="text-xl mt-4">
          <span className="text-2xl font-semibold">Director</span>:{" "}
          {director || "Not Available"}
        </h2>
        <h2 className="text-xl mt-2">
          <span className="text-2xl font-semibold">Writer</span>:{" "}
          {writer || "Not Available"}
        </h2>
        <h2 className="text-xl mt-4">
          <span className="text-2xl font-semibold">Star Cast:</span>
          <div className="flex flex-wrap gap-4 mt-2">
            {Array.isArray(castData?.cast) && castData.cast.length > 0 ? (
              castData.cast.slice(0, 10).map((starCast, index) => (
                <div key={index} className="flex flex-col items-center w-24">
                  <img
                    src={
                      starCast?.profile_path
                        ? imageURL + starCast.profile_path
                        : "https://via.placeholder.com/80x100?text=No+Image"
                    }
                    alt={starCast?.name}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                  <p className="text-sm mt-2 text-center">{starCast?.name}</p>
                </div>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </div>
        </h2>
      </div>

      {/* Similar Movies or Shows */}
      <div className="p-4 max-w-screen-xl mx-auto">
        <Horizontalscrollcard
          data={similarData?.results || []}
          heading={`Similar ${params?.explore}`}
          media_Type={params?.explore}
        />
      </div>

      {/* Recommendations */}
      <div className="p-4 max-w-screen-xl mx-auto">
        <Horizontalscrollcard
          data={recomendatitionData?.results || []}
          heading={`Recommendations ${params?.explore}`}
          media_Type={params?.explore}
        />
      </div>

      {/* Video Modal */}
      {playVideo && playVideoData && (
        <Videoplay
          data={playVideoData}
          close={() => setPlayVideo(false)}
          media_type={params?.explore}
        />
      )}

      {/* Modal Component */}
      <MovieAIModal
        isOpen={isModalOpen}
        onClose={closeModal}
        movieName={movieName}
        releaseDate={releaseDate}
      />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Detail;