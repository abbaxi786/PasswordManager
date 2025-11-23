'use client';
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { IoClipboardOutline } from "react-icons/io5";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  const letters = useMemo(
    () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    []
  );
  const numbers = useMemo(() => "0123456789", []);
  const symbols = useMemo(() => "!@#$%^&*()_+-=[]{}|;:,.<>?", []);

  const checkStrength = useCallback((pwd) => {
    if (!pwd) return setStrength("");

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[\W_]/.test(pwd)) score++;

    switch (score) {
      case 4:
        setStrength("Strong 💪");
        break;
      case 3:
        setStrength("Medium ⚡");
        break;
      case 2:
        setStrength("Weak ❌");
        break;
      default:
        setStrength("Very Weak ❌");
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkStrength(value);
  };

  const generatePassword = useCallback(
    (length = 12) => {
      const charset = letters + numbers + symbols;
      let pwd = "";
      for (let i = 0; i < length; i++) {
        pwd += charset[Math.floor(Math.random() * charset.length)];
      }
      setPassword(pwd);
      checkStrength(pwd);
    },
    [letters, numbers, symbols, checkStrength]
  );

  const copyToClipboard = useCallback(() => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  }, [password]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
        Password Generator
      </h1>

      {/* Password display & copy */}
      <div className="flex flex-col sm:flex-row w-full max-w-md gap-2 mb-2">
        <input
          type="text"
          value={password}
          onChange={handleInputChange} // ✅ live strength update
          className="input input-bordered flex-1 w-full"
          placeholder="Type or generate a password..."
        />
        <button
          className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-1"
          onClick={copyToClipboard}
        >
          <IoClipboardOutline /> Copy
        </button>
      </div>

      {/* Strength display */}
      {strength && (
        <p className="mb-4 font-semibold text-lg text-center">{strength}</p>
      )}

      {/* Responsive wrap buttons — equal size */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md">
        <button
          className="btn btn-secondary flex-1 min-w-[110px]"
          onClick={() => generatePassword(12)}
        >
          Generate 12
        </button>
        <button
          className="btn btn-secondary flex-1 min-w-[110px]"
          onClick={() => generatePassword(16)}
        >
          Generate 16
        </button>
        <button
          className="btn btn-secondary flex-1 min-w-[110px]"
          onClick={() => generatePassword(20)}
        >
          Generate 20
        </button>
      </div>

      {/* Link to Home */}
      <Link
        href="/pages/home"
        className="btn btn-accent text-white w-full sm:w-auto"
      >
        Go to Home (Your Passwords)
      </Link>
    </div>
  );
}
