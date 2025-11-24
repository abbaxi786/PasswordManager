"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component load
  useEffect(() => {
    function logged(){
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user); // true if user exists, false otherwise
    }

    logged();    
    }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        // Remove stored user
        localStorage.removeItem("user");
        setIsLoggedIn(false);

        router.push("/pages/signInUp");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-error text-left text-white "
      disabled={!isLoggedIn} // disable when no user
    >
      Logout
    </button>
  );
}
