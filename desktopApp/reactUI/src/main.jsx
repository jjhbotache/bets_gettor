import React, {  useState,useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider} from "react-router-dom";
import "./index.css"
import { inProduction } from './const/consts.js';
import 'react-toastify/dist/ReactToastify.css';
import router from "./router/router.jsx"



export let surebetsPeriod = [];



// if in production, wait for pywebview to be ready
inProduction
  ?(
    window.addEventListener('pywebviewready', ()=>{
      ReactDOM.createRoot(document.getElementById('root')).render(
        <>
          <React.StrictMode>
            <RouterProvider router={router}/>
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
        </React.StrictMode>
      </>
    )
  )



