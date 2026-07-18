import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500 flex items-center justify-center px-5 py-10">

      <div className="max-w-lg w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-white">

        <h1 className="text-5xl font-bold text-center mb-8">
          Contact
        </h1>

        <div className="space-y-6">

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
            <FaEnvelope className="text-2xl text-green-400" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>paldhaduk7@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
            <FaGithub className="text-2xl" />
            <div>
              <h3 className="font-semibold">GitHub</h3>
              <a
                href="https://github.com/paldhaduk7-png"
                target="_blank"
                className="hover:text-green-400"
              >
                github.com/yourusername
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
            <FaLinkedin className="text-2xl text-blue-400" />
            <div>
              <h3 className="font-semibold">LinkedIn</h3>
              <a
                href="https://www.linkedin.com/feed/"
                target="_blank"
                className="hover:text-green-400"
              >
                linkedin.com/in/yourprofile
              </a>
            </div>
          </div>

        </div>

        <p className="text-center text-gray-300 mt-10">
          Thanks for visiting ❤️
        </p>

      </div>

    </div>
  );
};

export default Contact;