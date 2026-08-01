import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contect from './pages/Contect'
import Manger from './pages/Manger'
import UpadteData from './curd Method/update';
import Login from './auth/Login';
import Signup from './auth/Signup';
import { Toaster } from "sonner";


function App() {
 
 const  passwordRouter= createBrowserRouter([
      {
       path:"/signup",
       element:
       <>
       <Navbar />
       <Signup />
       </>
    },
   {
       path:"/login",
       element:
       <>
       <Navbar />
       <Login />
      
       </>
    },
    {
       path:"/",
       element:
       <>
       <Navbar />
       <Manger />
       <Home />
       </>
    },
    {
       path:"/about",
       element:
       <>
       <Navbar />
       <About />
       </>
    },
    {
       path:"/contact",
       element:
       <>
       <Navbar />
       <Contect />
       </>
    },
    {
       path:"/update",
       element:
       <>
       <UpadteData />
       </>
    },
  ]
)

  return (
    <>
    <RouterProvider router={passwordRouter} />
    <Toaster position="bottom-right" />
    </>
  )
}

export default App
