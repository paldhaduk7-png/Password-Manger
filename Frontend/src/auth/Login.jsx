import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {

  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  // Handle login
  const submitData = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        input,
        {
          withCredentials: true
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };


  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl px-8 py-8">

        {/* Header */}
        <div className="text-center mb-7">

          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-2xl flex items-center justify-center">
            <LockKeyhole
              className="text-purple-600"
              size={25}
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-1">
            Login to access your passwords
          </p>

        </div>


        <form
          onSubmit={submitData}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition"
              />

            </div>
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">

              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                text-gray-500 hover:text-purple-600 transition"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>
          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700
            text-white font-semibold py-3 rounded-xl
            transition shadow-lg shadow-purple-200"
          >
            Login
          </button>

        </form>


        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:text-purple-800"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;