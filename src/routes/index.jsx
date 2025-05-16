import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Detail from "../pages/Detail";
import Explore from "../pages/Explore";

const router = createBrowserRouter([
  {
    path: "/", // layout wrapper
    element: <App />,
    children: [
      {
        path: "/", // Home
        element: <Home />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/explore/:id",
        element: <Explore />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        // ✅ ADD THIS ROUTE for /movie/:id or /tv/:id or /person/:id
        path: "/:explore/:id",
        element: <Detail />,
      },
    ],
  },
]);

export default router;
