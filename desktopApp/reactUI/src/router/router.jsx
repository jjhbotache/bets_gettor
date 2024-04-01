import { createBrowserRouter } from "react-router-dom";
import Logger from "../pages/logger/Logger";
import App from "../pages/app/App";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App/>,    
    },
    {
      path: "/logger",
      element: <Logger/>,    
    },
    {
      path: "*",
      element: <App/>,    
    },
  ]
);

export default router;