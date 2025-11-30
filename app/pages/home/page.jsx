'use client';
import { useEffect, useState } from 'react';
import { GoKey} from 'react-icons/go';
import { IoClipboardOutline } from "react-icons/io5";
import Image from 'next/image';
import StorePassword from '@/app/components/gettingPassword';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]);
  const [bool,setBool]= useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);

  function SetInfo(value){
    value = !value;
    setBool(value);
  }

  // Fetch passwords from API
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const res = await axios.get('https://password-manager-m2sn.vercel.app/api/data', {
          withCredentials: true
        });
        if (res.data && res.data.data) setData(res.data.data);
        console.log(res.data);
      } catch (err) {
        console.log('Error fetching passwords:', err.response?.data || err.message);
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

      {/* Hero Section */}
      <div className="flex flex-col items-center px-4 py-6 sm:py-8 md:py-10 bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
        <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
          <GoKey className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center">
          Password Manager
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/80 mt-1 sm:mt-2 text-center px-4">
          Securely store and manage your passwords
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Password Cards Grid */}
        {data.length > 0 ? (
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
          <div className="text-center py-12 sm:py-16 md:py-20">
            <GoKey className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-base-content/30 mb-4" />
            <p className="text-sm sm:text-base md:text-lg text-base-content/60">
              No passwords saved yet. Add your first password!
            </p>
          </div>
        )}

        {/* Add Password Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            className="btn btn-accent btn-sm sm:btn-md text-white shadow-lg hover:shadow-xl transition-all"
            onClick={() => document.getElementById('my_modal_3')?.showModal()}
          >
            <span className="text-sm sm:text-base">+ Add Password</span>
          </button>
        </div>
      </div>

      {/* Modal to show password */}
      {selectedPassword && (
        <dialog 
          id="password_modal" 
          className="modal modal-bottom sm:modal-middle" 
          open
        >
          <div className="modal-box w-11/12 max-w-md sm:max-w-lg">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 wrap-break-word">
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