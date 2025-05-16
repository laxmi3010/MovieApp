import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Card = ({ data, trending, index ,media_Type }) => {
  const imageURL = useSelector(state => state.movieoData.imageURL);

  // Fallback to 'movie' if media_type is undefined
  const mediaType = data.media_type ?? media_Type;

  return (
    <Link to={`/${mediaType}/${data.id}`}>

      
      <div className='w-full min-w-[230px] max-w-[230px] h-80 rounded overflow-hidden pt-3 relative hover:scale-105 transition-all lg:ml-10'>
        {
          data?.poster_path ? (
            <img
            src={imageURL + data?.poster_path}
            alt={data?.title || data?.name || 'Poster'}
            className="w-full h-full object-cover"
          />
          ) :(
            <div className=' bg-neutral-800 text-cyan-50 h-full w-full flex justify-center items-center'>
              No Image Found.
            </div>
          )
        }
        <img
          src={imageURL + data?.poster_path}
          alt={data?.title || data?.name || 'Poster'}
          className="w-full h-full object-cover"
        />
        {trending && (
          <div className='absolute top-5 left-0 py-1 px-4 backdrop-blur-3xl rounded-r-full bg-gray-200'>
            #{index} Trending
          </div>
        )}
        <div className='absolute bottom-0 h-14 bg-black/60 p-2 w-full text-cyan-50 backdrop-blur-3xl'>
          <h2 className='text-ellipsis line-clamp-1'>
            {data?.title || data?.name}
          </h2>
          <div className='flex justify-between items-center text-sm mt-1'>
            <p>{moment(data.release_date || data.first_air_date).format("MMMM DD, YYYY")}</p>
            <p className='bg-slate-600 text-cyan-50 px-2 py-0.5 rounded-full text-sm'>
              ⭐ {Number(data.vote_average).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
