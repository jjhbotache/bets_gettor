import React, {  useState,useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Logger from './pages/logger/Logger.jsx';
import "./index.css"
import Spinner from './components/Spinner/Spinner.jsx';



export let surebetsPeriod = [];

// log the path
console.log(window.location.pathname);

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
  ]);

if (Notification.permission !== "granted") {Notification.requestPermission();}
window.addEventListener('pywebviewready', ()=>{
  ReactDOM.createRoot(document.getElementById('root')).render(
    <>
      <React.StrictMode>
        <RouterProvider router={router}/>
      </React.StrictMode>
    </>
  )
})


