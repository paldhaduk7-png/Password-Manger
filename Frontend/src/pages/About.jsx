import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500 flex items-center justify-center px-5 py-10">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-white">

        <h1 className="text-5xl font-bold text-center mb-6">
          About <span className="text-green-400">PassOP</span>
        </h1>

        <p className="text-lg leading-8 text-center text-gray-200">
          <span className="font-bold text-white">PassOP</span> is a modern and
          secure password manager that helps users safely store their website
          credentials in one place.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-3">
              🔒 Secure Storage
            </h2>
            <p className="text-gray-300">
              Save website URLs, usernames and passwords in one secure place.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-3">
              ⚡ Fast & Simple
            </h2>
            <p className="text-gray-300">
              A clean and responsive interface for managing passwords easily.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-3">
              💻 Built With
            </h2>
            <p className="text-gray-300">
              React • Vite • Tailwind CSS • JavaScript
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-3">
              🎯 Goal
            </h2>
            <p className="text-gray-300">
              Make password management simple, secure and user-friendly.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;