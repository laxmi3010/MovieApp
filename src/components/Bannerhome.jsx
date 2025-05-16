import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaAngleRight, FaAngleLeft, FaAnglesLeft } from "react-icons/fa6";

const Bannerhome = () => {
  const bannerData = useSelector(state => state.movieoData.bannerData);
  const imageURL = useSelector(state => state.movieoData.imageURL);
  const [currentImage, setCurrentImage] = useState(0);

  const handlenext = () => {
    if (currentImage < bannerData.length - 1) {
      setCurrentImage(prev => prev + 1);
    }
  };

  const handleprevious = () => {
    if (currentImage > 0) {
      setCurrentImage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImage < bannerData.length - 1) {
        handlenext();
      } else {
        setCurrentImage(0);
      }
    }, 5000);

    return () => {
      clearInterval(interval); // Cleanup the interval on component unmount
    };
  }, [currentImage, bannerData.length]);

  return (
    <section className='w-full h-full'>
      <div className='flex min-h-full max-h-[95vh] w-full overflow-hidden'>
        {
          bannerData.map((data, index) => {
            return (
              <div
                className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all duration-500 ease-in-out'
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
                key={index}
              >
                <div className='w-full h-full'>
                  <img
                    src={imageURL + data.backdrop_path}
                    className='h-full w-full object-cover'
                    alt=""
                  />
                </div>

                {/* Buttons */}
                <div className='absolute top-0 text-white z-20 h-full w-full hidden items-center justify-between group-hover:lg:flex'>
                  <button onClick={handleprevious} className='bg-white text-black text-3xl rounded-full hover:bg-blue-600 p-3'>
                    <FaAnglesLeft />
                  </button>
                  <button onClick={handlenext} className='bg-white text-black text-3xl rounded-full hover:bg-blue-600 p-3'>
                    <FaAngleRight />
                  </button>
                </div>

                <div className='absolute top-0 h-full w-full bg-gradient-to-t from-neutral-900 to-transparent'>

                <div className='container mx-auto  w-full lg:overflow-hidden'>
                  <div className='absolute bottom-0 max-w-md text-white ml-5'>
                    <h2 className='font-bold text-3xl lg:text-2xl font-sans px-4'>{data.title || data.name}</h2>
                    <p className='text-ellipsis line-clamp-3 my-3'>{data.overview}</p>
                    <div className='flex flex-row gap-5 text-xl mb-2'>
                      <p className=''>Rating:{Number(data.vote_average).toFixed(1)}+</p>
                      <span> | </span>
                      <p className=''>Views:{data.vote_count}</p>
                    </div>
                    <button className='bg-white text-black w-20 text-sm h-10 font-bold rounded hover:bg-red-500 hover:scale-105 z-40'>
                      Play Now
                    </button>
                  </div>
                </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </section>
  );
};

export default Bannerhome;
