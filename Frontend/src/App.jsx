import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contect from './pages/Contect'
import Manger from './pages/Manger'
import UpadteData from './curd Method/update';



function App() {
 
 const  passwordRouter= createBrowserRouter([
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
    </>
  )
}

export default App
