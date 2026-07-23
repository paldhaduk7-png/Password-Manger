import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../pages/Navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";

export default function UpdateData() {

  const location = useLocation();
console.log(location.state);
const id = location.state?.id;
console.log(id);

const navigate = useNavigate();
const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [user, setUser] = useState({
    url: "",
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handelInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
  const getPassword = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);

      if (res.data.success) {
        setUser({
          url: res.data.data.weburl,
          userName: res.data.data.username,
          password: res.data.data.password,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load password");
    }
  };

  if (id) {
    getPassword();
  }
}, [id]);

  

const UpdatePassword= async()=>{
  try {
    const res=  await axios.put(`${BASE_URL}/${id}`, {
    weburl: user.url,
    username: user.userName,
    password: user.password
}); 
if (res.data.success) {
            setUser({
                url:"",
                userName:"",
                password:""
            });
      toast.success(res.data.message);
      navigate("/")
    }
  } catch (error) {
     console.log(error.response?.data);
    toast.error(error.response?.data?.message || "Something went wrong");
  }

}


  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500">

      <Navbar />

      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-mono font-semibold text-white">
          {"<Pass"}
          <span className="text-green-400">OP</span>
          {"/>"}
        </h1>

        <h2 className="text-2xl font-bold text-white mt-3">
          Update Password
        </h2>

        <p className="text-white/70 mt-2">
          Update your saved password
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/95 rounded-3xl shadow-2xl shadow-purple-900/30 w-[90%] max-w-5xl mx-auto p-8">

        {/* Website */}
        <input
          type="text"
          name="url"
          value={user.url}
          onChange={handelInputChange}
          placeholder="🔗 Enter Website URL"
          className="w-full mb-4 px-4 py-3 rounded-xl border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-violet-500"
        />

        {/* Username Password */}
        <div className="flex gap-4 flex-wrap">

          <input
            type="text"
            name="userName"
            value={user.userName}
            onChange={handelInputChange}
            placeholder="👤 Username"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-violet-500"
          />

          <div className="flex flex-1 items-center gap-2">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handelInputChange}
              placeholder="🔒 Password"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-violet-500"
            />

            {showPassword ? (
              <Eye
                className="cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeOff
                className="cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <button onClick={UpdatePassword}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Update
          </button>

        </div>

      </div>

    </div>
  );
}