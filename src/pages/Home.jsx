import React,{useState} from 'react'

const Home = () => {

// let [user,setUser]=useState({
//   'url':"",
//   'userName':'',
//   ''
// })


  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 font-sans pb-12">
        
      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-mono font-semibold text-white tracking-tight">
          {'<Pass'}
          <span className="text-green-400">OP</span>
          {'/>'}
        </h1>
        <p className="text-white/70 mt-2 text-base">Your own Password Manager</p>
      </div>

      {/* Card */}
     <div className="bg-white/95 rounded-2xl max-w-2xl mx-auto px-8 py-7 shadow-2xl shadow-purple-900/30 min-h-[480px]">

        {/* URL input */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="🔗  Enter website URL"
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 bg-purple-50 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-sm transition-all"
          />
        </div>

        {/* Username + Password + Button row */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="👤  Username"
            className="flex-1 min-w-[130px] px-4 py-3 rounded-xl border-2 border-purple-100 bg-purple-50 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-sm transition-all"
          />
          <input
            type="password"
            placeholder="🔒  Password"
            className="flex-1 min-w-[130px] px-4 py-3 rounded-xl border-2 border-purple-100 bg-purple-50 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-sm transition-all"
          />
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-400/40 hover:-translate-y-0.5 hover:shadow-purple-500/50 active:scale-95 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add Password
          </button>
        </div>

        {/* Divider + Your Passwords section */}
        <hr className="my-6 border-purple-100" />

        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-4">
          Your Passwords
        </p>

        <div className="flex flex-col items-center justify-center py-10 text-purple-200">
          <svg className="w-10 h-10 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-sm text-purple-300">No passwords saved yet. Add one above!</p>
        </div>

      </div>
    </div>
  )
}

export default Home