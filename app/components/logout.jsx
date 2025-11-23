"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        // Redirect after logout
        router.push("/signin"); // change to your login page route
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-error text-white"
    >
      Logout
    </button>
  );
}
