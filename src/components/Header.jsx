import React, { useEffect, useState } from "react";
import logo1 from "../assets/logo1.jpg";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { navigation } from "../constants/Navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setsearchInput] = useState(removeSpace);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    }
  }, [searchInput]);

  const submithandler = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("profile_name");
      sessionStorage.removeItem("premium_member");
      sessionStorage.removeItem("churn_detected");
      sessionStorage.removeItem("redirect_to");
      navigate("/login");
    }
  };

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 100);
    setHideTimeout(timeout);
  };

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

  return (
    <>
      <ToastContainer />
      <div className="z-10 w-full h-30 bg-slate-950 text-white fixed">
        <div className="container flex mx-auto p-2 items-center w-full h-full">
          <Link to={"/"}>
            <img
              src={logo1}
              alt="Our logo"
              width={90}
              className={"w-90 h-90 rounded-full ml-20 lg:ml-3"}
            />
          </Link>
          <nav className="flex gap-10 m-5 font-bold">
            {navigation.map((nav, index) => (
              <div key={index} className="flex">
                <NavLink
                  to={nav.href}
                  onClick={(e) => handleNavClick(e, nav.href)}
                  className={"hover:text-neutral-500 pl-10 lg:flex hidden"}
                >
                  {nav.label}
                </NavLink>
              </div>
            ))}
          </nav>
          <div className="flex ml-auto mr-5 gap-10">
            <form
              className="items-center gap-10 hidden lg:block"
              onSubmit={submithandler}
            >
              <input
                type="text"
                placeholder="Search here....."
                className="bg-transparent outline-none"
                onChange={(e) => setsearchInput(e.target.value)}
                value={searchInput}
              />
              <button className="text-3xl">
                <CiSearch />
              </button>
            </form>
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUserCircle className="w-10 h-10 text-white cursor-pointer hover:text-neutral-400 transition-colors" />

              {showDropdown && (
                <div
                  className="absolute right-0 top-12 bg-slate-800 text-white rounded-lg shadow-lg py-2 w-40 z-20"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-slate-700 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/subscription"
                    className="block px-4 py-2 hover:bg-slate-700 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Subscription
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;