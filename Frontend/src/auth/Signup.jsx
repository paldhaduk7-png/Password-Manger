import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import axios  from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {

const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
const navigate=useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const [input, setInput] = useState({
  fullname: "",
  email: "",
  phonenumber: "",
  password: "",
  confirmPassword: ""
});

const changeEventHandler = (e) => {
  setInput({
    ...input,
    [e.target.name]: e.target.value
  });
};

const submitData = async (e) => {
  e.preventDefault();

  if (input.password !== input.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }


  // Axios request next
try {
const res = await axios.post(`${BASE_URL}/register`, input);

  if (res.data.success) {
  toast.success(res.data.message);
  navigate("/login");
}
} catch (error) {
   toast.error(
    error.response?.data?.message || "Registration failed"
  );
}

};

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-xl bg-white/95 rounded-3xl shadow-2xl px-8 py-7">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-2xl flex items-center justify-center">
            <LockKeyhole className="text-purple-600" size={25} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-1">
            Start managing your passwords securely
          </p>
        </div>

        <form onSubmit={submitData} className="space-y-4">

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="Your name"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl
                  outline-none focus:border-purple-500 focus:ring-2
                  focus:ring-purple-200 transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  name="phonenumber"
                  value={input.phonenumber}
                  onChange={changeEventHandler}
                  placeholder="Phone number"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl
                  outline-none focus:border-purple-500 focus:ring-2
                  focus:ring-purple-200 transition"
                />
              </div>
            </div>

          </div>

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
                placeholder="Create a password"
                className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={changeEventHandler}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700
            text-white font-semibold py-3 rounded-xl
            transition shadow-lg shadow-purple-200"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:text-purple-800"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;