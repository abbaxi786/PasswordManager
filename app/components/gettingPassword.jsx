'use client';
import { useState, useEffect } from "react";
import axios from "axios";

function StorePassword({onAction}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  // Get user from localStorage on client side only
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("User not logged in.");
      return;
    }

    setLoading(true);
    setMessage("");

    function getFaviconURL(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    // Google's service is reliable and returns high-quality icons
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '/default-favicon.png'; // Make sure to add a default icon in your public folder
  }
}

    try {
      const tabIcon = getFaviconURL(url);
      const payload = {
        name: name,
        websiteURL: url,
        icon: tabIcon,
        password: password,
        email: account,
        user: user.id, // user id from localStorage
      };

      const res = await axios.post("/api/data", payload);
      console.log(JSON.stringify(res.data));
      setMessage("Password stored successfully!");
      setName("");
      setUrl("");
      setAccount("");
      setPassword("");
      onAction(false);
      document.getElementById("my_modal_3")?.close();
    } catch (err) {
      console.error(err);
      setMessage("Failed to store password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("my_modal_3")?.close()}
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-4">Store New Password</h3>

          <input
            type="text"
            placeholder="Name (e.g., Google)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full mb-2"
            required
          />
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input input-bordered w-full mb-2"
            required
          />
          <input
            type="email"
            placeholder="Account Email"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="input input-bordered w-full mb-2"
            required
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full mb-4"
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </form>

        {message && <p className="mt-2 text-center">{message}</p>}
      </div>
    </dialog>
  );
}

export default StorePassword;
