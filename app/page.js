'use client';
import { useState, useMemo, useCallback } from "react";
import { IoClipboardOutline } from "react-icons/io5";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [copied, setCopied] = useState(false);

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
    setCopied(false);
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
      setCopied(false);
    },
    [letters, numbers, symbols, checkStrength]
  );

  const copyToClipboard = useCallback(() => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 font-sans p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-center bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Password Generator
        </h1>

        {/* Password display & copy */}
        <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={password}
              onChange={handleInputChange}
              className="input input-bordered w-full h-12 sm:h-14 text-base sm:text-lg pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Type or generate a password..."
            />
          </div>
          <button
            className={`btn h-12 sm:h-14 w-full sm:w-auto px-6 flex items-center justify-center gap-2 text-base sm:text-lg transition-all ${
              copied 
                ? 'btn-success' 
                : 'btn-primary hover:scale-105'
            }`}
            onClick={copyToClipboard}
            disabled={!password}
          >
            <IoClipboardOutline className="text-xl" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            <span className="sm:hidden">{copied ? '✓' : 'Copy'}</span>
          </button>
        </div>

        {/* Strength display */}
        {strength && (
          <div className="mb-6 p-4 rounded-lg bg-linear-to-r from-gray-50 to-gray-100 border border-gray-200">
            <p className="font-semibold text-lg sm:text-xl text-center text-gray-800">
              Strength: <span className="text-blue-600">{strength}</span>
            </p>
          </div>
        )}

        {/* Generate buttons - Fully responsive grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            className="btn btn-secondary h-12 sm:h-14 text-base sm:text-lg hover:scale-105 transition-transform"
            onClick={() => generatePassword(12)}
          >
            Generate 12
          </button>
          <button
            className="btn btn-secondary h-12 sm:h-14 text-base sm:text-lg hover:scale-105 transition-transform"
            onClick={() => generatePassword(16)}
          >
            Generate 16
          </button>
          <button
            className="btn btn-secondary h-12 sm:h-14 text-base sm:text-lg hover:scale-105 transition-transform xs:col-span-2 sm:col-span-1"
            onClick={() => generatePassword(20)}
          >
            Generate 20
          </button>
        </div>

        {/* Tips section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 mb-6">
          <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-900">
            💡 Password Tips:
          </h3>
          <ul className="text-sm sm:text-base text-blue-800 space-y-1">
            <li>• Use at least 12 characters</li>
            <li>• Mix uppercase, lowercase, numbers & symbols</li>
            <li>• Never reuse passwords across sites</li>
          </ul>
        </div>

        {/* Link to Home */}
        <button
          className="btn btn-accent text-white w-full h-12 sm:h-14 text-base sm:text-lg hover:scale-105 transition-transform shadow-lg"
          onClick={() => window.location.href = '/pages/home'}
        >
          Go to Home (Your Passwords)
        </button>
      </div>
    </div>
  );
}