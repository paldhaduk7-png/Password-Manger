import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Navbar = () => {

const { user, setUser } = useContext(AuthContext);
  // console.log(user);

  const navigate=useNavigate();
 const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

const UserLogout = async () => {
  try {
    const res = await axios.post(
      `${BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      setUser(null);

      toast.success(res.data.message);
      navigate("/");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Logout failed"
    );
  }
};


  return (
    <div className='flex items-center justify-between px-6 py-3 bg-purple-500 text-white shadow-md'>

      {/* Logo */}
      <h1 className='text-2xl font-bold tracking-wide cursor-pointer'>
        Password Manager
      </h1>

      {/* Links */}
      <ul className='flex items-center gap-6 text-lg font-medium'>

        {user ? (
          <>
            <li>
              <Link
                to="/"
                className='hover:text-gray-200 transition duration-200'
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className='hover:text-gray-200 transition duration-200'
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className='hover:text-gray-200 transition duration-200'
              >
                Contact
              </Link>
            </li>
            <li onClick={UserLogout}>
              <Link
                to="/contact"
                className='hover:text-gray-200 transition duration-200'
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
              <li>
  <Link
    to="/signup"
    className="bg-white text-purple-600 px-5 py-2 rounded-lg
    font-semibold hover:bg-purple-50 transition duration-200 shadow-sm"
  >
    Sign Up
  </Link>
</li>

<li>
  <Link
    to="/login"
    className="border-2 border-white/70 text-white px-5 py-2 rounded-lg
    font-semibold hover:bg-white hover:text-purple-600
    transition duration-200"
  >
    Login
  </Link>
</li>

          </>
        )}

      </ul>

    </div>
  )
}

export default Navbar