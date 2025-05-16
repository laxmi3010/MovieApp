import React from 'react';
import { mobilenav } from "../constants/Navigation";
import { NavLink } from 'react-router-dom';

const Mobileview = () => {
  return (
    <section className='lg:hidden h-16 bg-slate-400 bg-opacity-30 fixed bottom-0 w-full flex items-center justify-between px-4 text-2xl cursor-pointer '>
      {mobilenav.map((nav, index) => {
        return (
          <NavLink
            key={nav.label + index}
            className='flex flex-col items-center justify-center text-xl space-y-1 active:bg-red-600 cursor-pointer'
            to={nav.href}
          >
            <div className='flex justify-center text-2xl'>
              {nav.icon}
            </div>
            <p className='text-xs sm:text-sm'>{nav.label}</p>
          </NavLink>
        );
      })}
    </section>
  );
};

export default Mobileview;
