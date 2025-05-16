import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';

const Explore = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/discover/${params.id}`, {
        params: {
          page: pageNo
        }
      });
      setData(prev => [...prev, ...response.data.results]);
      setTotalData(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset data when params.id changes
  useEffect(() => {
    setPageNo(1);
    setData([]);
    window.scrollTo(0, 0); // Scroll to top on type change
  }, [params.id]);

  // Fetch data when page or id changes
  useEffect(() => {
    fetchData();
  }, [pageNo, params.id]);

  const handleScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200 &&
      pageNo < totalData &&
      !loading
    ) {
      setPageNo(prev => prev + 1);
    }
  };

  // Set up scroll event
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, totalData, pageNo]);

  return (
    <div className='pt-20'>
      <div className='container m-auto px-4'>
        <h3 className='capitalize text-cyan-50 text-2xl font-bold my-2'>
          Popular {params.id} Shows
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {data.map((exploreData) => (
            <Card
              data={exploreData}
              key={exploreData.id + "-exploreSection"}
              media_Type={params.id}
            />
          ))}
        </div>
        {loading && <p className="text-cyan-300 text-center my-4">Loading more...</p>}
      </div>
    </div>
  );
};

export default Explore;
