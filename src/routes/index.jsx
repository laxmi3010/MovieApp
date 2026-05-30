import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home";
import Search from "../pages/Search";
import Detail from "../pages/Detail";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../utils/PrivateRoute";
import PublicRoute from "../utils/PublicRoute";
import WatchTogether from "../pages/Watchtogether";
import Quiz from "../pages/Quiz";
import Subscription from "../pages/Subscription";
import VideoWatchPage from "../pages/VideoWatchpage";
import LiveWatchPage from "../pages/LiveWatchPage";

const router = createBrowserRouter([
  {
    element: <PrivateRoute />, // 🔐 protected routes
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "explore", element: <Explore /> },
          { path: "explore/:id", element: <Explore /> },
          { path: "search", element: <Search /> },
          { path: ":explore/:id", element: <Detail /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/spotlight", element: <WatchTogether /> },
          { path: "/quiz", element: <Quiz /> },
          { path: "/subscription", element: <Subscription /> },
          { path: "/live-watch", element: <VideoWatchPage /> },
          { path: "/live-watch/:code", element: <LiveWatchPage /> },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />, // 🚫 login/register only if NOT logged in
    children: [
      {
        path: "/login",
        element: <AuthLayout />,
        children: [{ index: true, element: <Login /> }],
      },
      {
        path: "/register",
        element: <AuthLayout />,
        children: [{ index: true, element: <Signup /> }],
      },
    ],
  },
]);

export default router;
