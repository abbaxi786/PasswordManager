'use client';
import { useState } from 'react';
import axios from 'axios';

function LogIn() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState(false);
  const [color, setColor] = useState('p-6 badge badge-error');
  function ErrorShow(show) {
    setMessage(true);
    setError(show);
    setTimeout(() => {
      setMessage(false);
    }, 2000);
  }

  const [form, setForm] = useState({
    email: "",
    password: "",
    type: "logIn"
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log("📤 Sending login request...");

      const response = await axios.post(
        '/api/user', // ✅ Fixed: relative URL
        form,
        {
          withCredentials: true,
        }
      );

      // console.log("Response:", response?.data);

      if (response?.data?.success) {
        setColor("p-6 badge badge-success");
        ErrorShow(response?.data?.message);
        // optional: store user info (NOT TOKEN)
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // optional: redirect after successful login
        setTimeout(() => {
          window.location.href = "/pages/home"; // or your protected page
        }, 1000);

        return;
      } else {
        setColor("p-6 badge badge-error");
        ErrorShow(response?.data?.message || "Invalid credentials");
      }

    } catch (error) {
      console.error("🔥 Login error:", error);
      setColor("p-6 badge badge-error");
      
      if (error.response) {
        ErrorShow(error.response.data?.message || "Server error: " + error.message);
      } else if (error.request) {
        ErrorShow("Cannot connect to server");
      } else {
        ErrorShow("Server error: " + error.message);
      }
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

        <div className="flex flex-col">
          <label className="text-blue-900 font-medium">Email:</label>
          <input
            className="bg-blue-100 input input-md rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-blue-900 font-medium">Password:</label>
          <input
            className="bg-blue-100 input input-md rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-accent w-full mt-2">
          Enter
        </button>

        {message && (
          <div className={color}>
            {error}
          </div>
        )}

      </form>
    </div>
  );
}

export default LogIn;