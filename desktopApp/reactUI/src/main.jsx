import React, {  useState,useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider} from "react-router-dom";
import "./index.css"
import { inProduction } from './const/consts.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from "./router/router.jsx"



export let surebetsPeriod = [];



const ToastCustomContainer = <ToastContainer
  position="top-right"
  autoClose={2000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss={false}
  draggable
  pauseOnHover={false}
  theme="dark"
  />;
// if in production, wait for pywebview to be ready
inProduction
  ?(
    window.addEventListener('pywebviewready', ()=>{
      ReactDOM.createRoot(document.getElementById('root')).render(
        <>
          <React.StrictMode>
            <RouterProvider router={router}/>
            {ToastCustomContainer}
          </React.StrictMode>
        </>
      )
    })
  )
  :(
    ReactDOM.createRoot(document.getElementById('root')).render(
      <>
        <React.StrictMode>
          <RouterProvider router={router}/>
          {ToastCustomContainer}
        </React.StrictMode>
      </>
    )
  )



