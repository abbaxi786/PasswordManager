'use client';
import { useEffect, useState } from 'react';
import { GoKey } from 'react-icons/go';
import { IoClipboardOutline } from "react-icons/io5";
import Image from 'next/image';
import StorePassword from '@/app/components/gettingPassword';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]);
  const [bool, setBool] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function SetInfo(value) {
    value = !value;
    setBool(value);
  }

  // Fetch passwords from API
  useEffect(() => {
    const fetchPasswords = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/data', {
          withCredentials: true
        });
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
        console.log(res.data);
      } catch (err) {
        console.log('Error fetching passwords:', err.response?.data || err.message);
        setError('Failed to load passwords. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPasswords();
  }, [bool]);

  // Helper to get favicon
  const getFavicon = (url) => {
    if (!url) return '';
    return url.endsWith('/') ? url + 'favicon.ico' : url + '/favicon.ico';
  };

  // Copy password to clipboard
  const copyPassword = () => {
    if (selectedPassword) {
      navigator.clipboard.writeText(selectedPassword.password);
      alert('Password copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <StorePassword onAction={SetInfo} />

      {/* Hero Section with Key Logo Banner */}
      <div className="flex flex-col items-center px-4 py-6 sm:py-8 md:py-10 bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <GoKey className="absolute top-4 left-4 w-12 h-12 text-white transform rotate-12" />
          <GoKey className="absolute top-8 right-8 w-16 h-16 text-white transform -rotate-45" />
          <GoKey className="absolute bottom-6 left-1/4 w-10 h-10 text-white transform rotate-90" />
          <GoKey className="absolute bottom-4 right-1/3 w-14 h-14 text-white transform -rotate-12" />
        </div>

        {/* Main Key Logo */}
        <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-full mb-3 sm:mb-4 relative z-10 shadow-lg">
          <GoKey className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-pulse" />
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center relative z-10">
          Password Manager
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/80 mt-1 sm:mt-2 text-center px-4 relative z-10">
          Securely store and manage your passwords
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
            <div className="relative">
              {/* Animated spinner */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              {/* Key icon in center */}
              <GoKey className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-base-content/70 font-medium">
              Loading your passwords...
            </p>
            <div className="flex gap-1 mt-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="bg-error/10 p-4 sm:p-6 rounded-lg max-w-md mx-auto">
              <GoKey className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-error mb-4" />
              <p className="text-sm sm:text-base md:text-lg text-error font-semibold mb-2">
                {error}
              </p>
              <button
                className="btn btn-error btn-sm sm:btn-md mt-4 text-white"
                onClick={() => setBool(!bool)}
              >
                Retry
              </button>
            </div>
          </div>
        ) : data.length > 0 ? (
          /* Password Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {data.map((item, key) => (
              <button
                key={key}
                className="flex items-center p-3 sm:p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 bg-base-200 hover:bg-base-300 active:scale-95 w-full"
                onClick={() => setSelectedPassword(item)}
              >
                <div className="shrink-0 mr-3 sm:mr-4">
                  <Image
                    src={item.icon || getFavicon(item.websiteURL)}
                    alt={`${item.name} favicon`}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded"
                    unoptimized
                  />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h2 className="font-semibold text-sm sm:text-base md:text-lg truncate">
                    {item.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-base-content/70 truncate">
                    {item.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 md:py-20">
            <GoKey className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-base-content/30 mb-4" />
            <p className="text-sm sm:text-base md:text-lg text-base-content/60">
              No passwords saved yet. Add your first password!
            </p>
          </div>
        )}

        {/* Add Password Button */}
        {!loading && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              className="btn btn-accent btn-sm sm:btn-md text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => document.getElementById('my_modal_3')?.showModal()}
            >
              <span className="text-sm sm:text-base">+ Add Password</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal to show password */}
      {selectedPassword && (
        <dialog 
          id="password_modal" 
          className="modal modal-bottom sm:modal-middle" 
          open
        >
          <div className="modal-box w-11/12 max-w-md sm:max-w-lg">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 wrap-break-words">
              Password for {selectedPassword.websiteURL}
            </h3>
            
            <div className="bg-base-200 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-base-content/60 mb-1">Email</p>
              <p className="font-medium text-sm sm:text-base break-all mb-3 sm:mb-4">
                {selectedPassword.email}
              </p>
              
              <p className="text-xs sm:text-sm text-base-content/60 mb-1">Password</p>
              <p className="font-mono font-semibold text-sm sm:text-base md:text-lg break-all">
                {selectedPassword.password}
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="btn btn-ghost btn-sm sm:btn-md w-full sm:w-auto"
                onClick={() => setSelectedPassword(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary btn-sm sm:btn-md flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={copyPassword}
              >
                <IoClipboardOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Copy Password</span>
              </button>
            </div>
          </div>
          
          {/* Click outside to close */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedPassword(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

export default Home;