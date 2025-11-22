'use client';
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { IoClipboardOutline } from "react-icons/io5";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  // Memoize character sets
  const letters = useMemo(() => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", []);
  const numbers = useMemo(() => "0123456789", []);
  const symbols = useMemo(() => "!@#$%^&*()_+-=[]{}|;:,.<>?", []);

  // Check password strength
  const checkStrength = useCallback((pwd) => {
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

  // Generate password (pure, called only on click)
  const generatePassword = useCallback(
    (length = 12) => {
      const charset = letters + numbers + symbols;
      let pwd = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        pwd += charset[randomIndex];
      }
      setPassword(pwd);
      checkStrength(pwd);
    },
    [letters, numbers, symbols, checkStrength]
  );

  // Copy password
  const copyToClipboard = useCallback(() => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  }, [password]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  font-sans p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Password Generator</h1>

      {/* Password display and copy */}
      <div className="flex w-full max-w-md gap-2 mb-2">
        <input
          type="text"
          value={password}
          readOnly
          className="input input-bordered flex-1"
          placeholder="Generated password will appear here"
        />
        <button
          className="btn btn-primary flex items-center gap-1"
          onClick={copyToClipboard}
        >
          <IoClipboardOutline /> Copy
        </button>
      </div>

      {/* Strength display */}
      {strength && <p className="mb-4 font-semibold">{strength}</p>}

      {/* Generate buttons */}
      <div className="flex gap-2 mb-6">
        <button className="btn btn-secondary" onClick={() => generatePassword(12)}>
          Generate 12 chars
        </button>
        <button className="btn btn-secondary" onClick={() => generatePassword(16)}>
          Generate 16 chars
        </button>
        <button className="btn btn-secondary" onClick={() => generatePassword(20)}>
          Generate 20 chars
        </button>
      </div>

      {/* Link to Home */}
      <Link href="/pages/home" className="btn btn-accent text-white">
        Go to Home (Your Passwords)
      </Link>
    </div>
  );
}
