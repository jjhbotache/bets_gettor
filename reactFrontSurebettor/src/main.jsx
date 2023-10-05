import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Link} from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App/>,    
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
