import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Link} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,    
  },
  {
    path: "/2",
    element: (
      <>
      <h2>2 page</h2>
      <Link to="/">Go to home</Link>
      </>
    ),    
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  </>
)
