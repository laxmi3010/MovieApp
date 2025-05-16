import React, { useEffect, useState } from 'react';
import logo1 from "../assets/logo1.jpg";
import {Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import user from "../assets/user.avif";
import { CiSearch } from "react-icons/ci";
import { navigation } from "../constants/Navigation"; 


<Navigation/>
const Header = () => {
  const location = useLocation()
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join( ' ')
  const [searchInput, setsearchInput] = useState(removeSpace);
  const navigate = useNavigate();


  console.log("Location",)

 
  useEffect(() => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    }
  }, [searchInput]);

 const submithandler = (e)=>{
  e.preventDefault()
 }

  return (
    <div className='z-10 w-full h-30 bg-slate-950 text-white fixed  '>
      <div className='container flex mx-auto p-2 items-center w-full h-full '>
        <Link to={'/'}>
          <img src={logo1} alt="Our logo" width={90} className='w-90 h-90 rounded-full ml-20 lg: ml-3' 
          />
        </Link>
        <nav className='flex gap-10 m-5 font-bold  '>
          {navigation.map((nav, index) => (
            <div key={index} className='flex'>
              <NavLink to={nav.href} className={'hover:text-neutral-500 pl-10 lg:flex hidden'}>
                {nav.label}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className='flex ml-auto mr-5 gap-10'>
          <form className=' items-center gap-10 hidden lg:block' onSubmit={submithandler}>
            <input
              type="text"
              placeholder="Search here....."
              className="bg-transparent outline-none"
              onChange={(e) => setsearchInput(e.target.value)}
              value={searchInput}
            />
            <button className='text-3xl'>
              <CiSearch />
            </button>
          </form>
          <div>
            <img src={user} alt="user logo" className='w-10 h-10 rounded-full active:scale-50' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
