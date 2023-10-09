import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Link} from "react-router-dom";
import Logger from './pages/logger/Logger.jsx';


export let surebetsPeriod = [];

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
  ]);

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  </>
)
