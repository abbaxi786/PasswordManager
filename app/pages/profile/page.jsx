'use client';
import { useState, useEffect } from 'react';
import LogoutButton from '@/app/components/logout';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return ()=>{

        // Safely access localStorage only on client side
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // Mock data for demo if no user in localStorage
                setUser({
                    id: "692303eb13803f493ab61fa7",
                    username: "Nabeel Ahmed",
                    email: "faizan228100@gmail.com",
                    createdAt: "2025-11-23T12:54:03.862Z"
                });
            }
        }
    }
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate days since joining
  const getDaysSinceJoining = (dateString) => {
    const joinDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-linear-to-br from-white via-gray-50 to-white shadow-2xl border border-gray-200/50">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="avatar placeholder mb-4">
                <div className="bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-full w-24">
                  <span className="text-3xl font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Profile Information
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Member for {getDaysSinceJoining(user.createdAt)} days
              </p>
            </div>

            {/* User ID Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-600 font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  User ID
                </span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={user.id} 
                  readOnly 
                  className="input input-bordered w-full bg-linear-to-r from-gray-50 to-white border-gray-300 text-gray-700 font-mono text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <div className="badge badge-sm bg-linear-to-r from-blue-500 to-purple-600 text-white border-0">ID</div>
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-600 font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Username
                </span>
              </label>
              <input 
                type="text" 
                value={user.username} 
                readOnly 
                className="input input-bordered w-full bg-linear-to-r from-gray-50 to-white border-gray-300 text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-600 font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </span>
              </label>
              <input 
                type="email" 
                value={user.email} 
                readOnly 
                className="input input-bordered w-full bg-linear-to-r from-gray-50 to-white border-gray-300 text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Join Date Field */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-gray-600 font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined
                </span>
              </label>
              <input 
                type="text" 
                value={formatDate(user.createdAt)} 
                readOnly 
                className="input input-bordered w-full bg-linear-to-r from-gray-50 to-white border-gray-300 text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            
            <div className="card-actions justify-end mt-4">
              {/* <button className="btn btn-wide bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"> */}
                <LogoutButton  />
              {/* </button> */}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;