import React from 'react';
import Card from './Card';

const Horizontalscrollcard = ({ data = [], heading, trending , media_Type}) => {
  const handleScrollRight = () => {
    const scrollableDiv = document.getElementById('horizontal-scroll-container');
    scrollableDiv.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  };

  const handleScrollLeft = () => {
    const scrollableDiv = document.getElementById('horizontal-scroll-container');
    scrollableDiv.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  };

  return (
    <div className='container px-3 my-10 mx-auto relative'>
      <h2 className='text-3xl font-serif text-white mb-4'>{heading}</h2>

      <div className='w-full overflow-hidden'>
        <div
          id="horizontal-scroll-container"
          className='flex gap-6 w-full overflow-x-auto pb-2 scrollbar-hide'
        >
          {data?.map((item, index) => (
            <Card
              key={item.id + "heading" + index}
              data={item}
              index={index + 1}
              trending={trending}
              media_Type={media_Type}
            />
          ))}
        </div>
      </div>

      {/* Scroll Left Button */}
      <button
        onClick={handleScrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition duration-200 z-10"
        style={{ top: '50%', left: '20px' }}
      >
        ←
      </button>

      {/* Scroll Right Button */}
      <button
        onClick={handleScrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition duration-200 z-10"
        style={{ top: '50%', right: '20px' }}
      >
        →
      </button>
    </div>
  );
};

export default Horizontalscrollcard;
