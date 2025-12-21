"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GoKey } from "react-icons/go";
import { TfiMenuAlt } from "react-icons/tfi";
import { useRouter } from "next/navigation";
import LogoutButton from "./logout";

function Nav() {
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  // Apply theme to <html> tag
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav className="flex items-center justify-between p-4 bg-base-200 shadow">
      {/* Left: Home Icon + Title */}
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-blue-600 p-1 rounded-md shadow-md">
            <GoKey className="text-white w-6 h-6 sm:w-5 sm:h-5" />
          </div>
          <h1 className="text-xl text-blue-600 font-bold sm:text-lg xs:text-base">
            Password Manager
          </h1>
        </div>
      </Link>

      {/* Right: Theme toggle + Dropdown */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          className="btn btn-sm btn-outline text-sm sm:text-xs"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* Dropdown Menu */}
        <details className="dropdown dropdown-end relative">
          <summary className="btn btn-sm m-1 cursor-pointer flex items-center justify-center">
            <TfiMenuAlt className="w-5 h-5 sm:w-4 sm:h-4" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box w-52 p-2 shadow absolute right-0 mt-2">
            <li>
              <Link className="btn btn-secondary text-white my-1" href="/pages/profile">Profile</Link>
            </li>
            <li>
              <Link className="btn btn-success text-white my-1" href="/pages/signInUp">Log / Sign In</Link>
            </li>
            <li>
              <LogoutButton/>
            </li>
          </ul>
        </details>
      </div>
    </nav>
  );
}

export default Nav;
