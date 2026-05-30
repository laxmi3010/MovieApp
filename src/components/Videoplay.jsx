// src/components/Videoplay.jsx

import React, { useRef } from "react";
import { IoIosClose } from "react-icons/io";
import YouTube from "react-youtube";
import useFetchDetail from "../hooks/useFetchDetail";
import API_URL from "../config/api";

const Videoplay = ({ data, close, media_type }) => {
  const id = data?.id;
  const playerRef = useRef(null);

  const { data: videoData, loading } = useFetchDetail(
    id ? `/${media_type}/${id}/videos` : null
  );

  const videoKey = videoData?.results?.[0]?.key;

  console.log(`Video key : ${videoKey}`)

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  // =========================
  // SAVE WATCH PROGRESS
  // ONLY WHEN USER CLICKS X
  // =========================
  const saveWatchProgress = async () => {
    if (!playerRef.current) return;

    const watchedSeconds = playerRef.current.getCurrentTime();
    const totalDuration = playerRef.current.getDuration();

    if (!watchedSeconds || !totalDuration) return;

    const completionRate =
      totalDuration > 0 ? watchedSeconds / totalDuration : 0;


      console.log(`Watched Seconds : ${watchedSeconds}`)
      console.log(`Total Duration : ${totalDuration}`)
      console.log(`Completion Rate : ${completionRate}`)

    try {
      const response = await fetch(`${API_URL}/watch-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          explore: media_type,
          id: id,
          watchedSeconds,
          totalDuration,
          completionRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save watch progress");
      }

      const result = await response.json();
      console.log("Watch progress saved:", result);
    } catch (error) {
      console.error("Error saving watch progress:", error);
    }
  };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <section className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full bg-black">

        {/* Close Button */}
        <button
          onClick={async () => {
            await saveWatchProgress();   // ✅ Wait until saved
            close();                     // ✅ Then close
          }}
          className="absolute right-2 top-2 text-white text-3xl p-1 transition-colors duration-200 hover:bg-red-600 z-50"
        >
          <IoIosClose />
        </button>

        {/* Content */}
        {loading ? (
          <div className="text-white flex justify-center items-center h-full">
            Loading video...
          </div>
        ) : videoKey ? (
          <YouTube
            videoId={videoKey}
            opts={opts}
            className="w-full h-full"
            iframeClassName="w-full h-full"
            onReady={onReady}
          />
        ) : (
          <div className="text-white flex justify-center items-center h-full">
            No video available
          </div>
        )}
      </div>
    </section>
  );
};

export default Videoplay;