'use client';
import { useState } from 'react';
import axios from 'axios';


function SignIn({func}) {

  const [error, setError] = useState('');
  const [message, setMessage] = useState(false);
  const [color,setColor]= useState('p-6 badge badge-error')


  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "register"
  });

  function ErrorShow(msg,logIn=false) {
    setError(msg);
    setMessage(true);
    setTimeout(() => {setMessage(false)
      if(logIn){
        func('logIn');
      }
      setColor('p-6 badge badge-error');
    }, 2000);
    
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 🔴 Check confirm password
      if (form.password !== form.confirmPassword) {
        ErrorShow("The confirm password does not match the actual password.");
        return;
      }

      // 🟢 Correct axios POST request
      const response = await axios.post('/api/user', form);

      console.log("SignIn Response: ", response.data);

      if (response.data.success) {
        setColor('p-6 badge badge-success')
        ErrorShow(response.data.message,true);
      } else {
        ErrorShow("Registration failed.");
      }

    } catch (err) {
      ErrorShow("Server error: " + err.message);
      console.log(err);
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
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 w-full"
      >

        {/* Username */}
        <div className="flex flex-col">
          <label className="text-blue-900 font-medium">Username:</label>
          <input
            className="bg-blue-100 input input-md rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label className="text-blue-900 font-medium">Confirm Password:</label>
          <input
            className="bg-blue-100 input input-md rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-accent w-full mt-2"
        >
          Create Account
        </button>

        {/* Error Message */}
        {message && (
          <div className={color}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default SignIn;
