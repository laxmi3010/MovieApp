import React from "react";
import { useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import { useSelector } from "react-redux";
import Horizontalscrollcard from "../components/Horizontalscrollcard";

const Detail = () => {
  const params = useParams();
  const imageURL = useSelector((state) => state.movieoData.imageURL);

  const { data } = useFetchDetail(`/${params?.explore}/${params?.id}`);
  const { data: castData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/credits`
  );
  const { data: similarData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/similar`
  );

  const { data: recomendatitionData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/recommendations`
  );

  const writer = castData?.crew
    ?.filter(
      (el) =>
        el?.job?.toLowerCase().includes("writer") ||
        el?.job === "Screenplay" ||
        el?.job === "Story"
    )
    ?.map((el) => el?.name)
    .join(", ");

  const director = castData?.crew?.find((el) => el.job === "Director")?.name;

  if (!data || !castData) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:h-screen max-w-screen-xl mx-auto">
        {/* Left - Image */}
        <div className="w-full md:w-1/2 flex justify-start items-center p-4">
          <img
            src={imageURL + data?.backdrop_path}
            alt="Backdrop"
            className="w-full h-[50vh] md:w-[120%] md:h-[80vh] object-cover rounded"
          />
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
            <h2>Release Date: {data.release_date}</h2>
          </div>
          <div className="my-3">
            <p className="text-gray-300 font-semibold md:text-base text-xl">
              Overview: {data.overview}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap text-sm md:text-base">
            <h2>Status: {data.status}</h2>
            <span>|</span>
            <h2>Release Date: {data.release_date}</h2>
            <span>|</span>
            <h2>Revenue: {data.revenue}</h2>
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

      <div className="p-4 max-w-screen-xl mx-auto">
        <Horizontalscrollcard
          data={recomendatitionData?.results || []}
          heading={`Recommendations ${params?.explore}`}
          media_Type={params?.explore}
        />
      </div>
    </div>
  );
};

export default Detail;
