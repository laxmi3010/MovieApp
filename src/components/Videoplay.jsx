// src/components/Videoplay.jsx
import React from 'react';
import { IoIosClose } from 'react-icons/io';
import useFetchDetail from '../hooks/useFetchDetail';

const Videoplay = ({ data, close, media_type }) => {
  const id = data?.id;

  const { data: videoData, loading } = useFetchDetail(
    id ? `/${media_type}/${id}/videos` : null
  );

  const videoKey = videoData?.results?.[0]?.key;

  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-black w-full max-w-3xl aspect-video rounded relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute right-2 top-2 text-white text-3xl p-1 transition-colors duration-200 hover:bg-red-600"
        >
          <IoIosClose />
        </button>

        {/* Content */}
        {loading ? (
          <div className="text-white flex justify-center items-center h-full">
            Loading video...
          </div>
        ) : videoKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Video Player"
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
