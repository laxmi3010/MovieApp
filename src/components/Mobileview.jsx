import React from "react";
import { mobilenav } from "../constants/Navigation";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Check if user is premium member
const checkPremiumAccess = (href) => {
  const isPremium = sessionStorage.getItem("premium_member");
  const restrictedRoutes = ["/quiz", "/spotlight"];

  if (restrictedRoutes.includes(href) && isPremium !== "true") {
    return false;
  }
  return true;
};

// Handle navigation click with premium check
const handleNavClick = (e, href) => {
  if (!checkPremiumAccess(href)) {
    e.preventDefault();
    toast.error("Premium membership is required", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  }
};

const Mobileview = () => {
  return (
    <>
      {" "}
      <ToastContainer />
      <section className="lg:hidden h-16 bg-gray-100 bg-opacity-30 fixed bottom-0 w-full flex items-center justify-between px-4 text-2xl cursor-pointer ">
        {mobilenav.map((nav, index) => {
          return (
            <NavLink
              key={nav.label + index}
              className="flex flex-col items-center justify-center text-xl space-y-1 active:bg-red-600 cursor-pointer"
              to={nav.href}
              onClick={(e) => handleNavClick(e, nav.href)}
            >
              <div className="flex justify-center text-2xl">{nav.icon}</div>
              <p className="text-xs sm:text-sm">{nav.label}</p>
            </NavLink>
          );
        })}
      </section>
    </>
  );
};

export default Mobileview;
