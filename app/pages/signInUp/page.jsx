'use client';
import SignIn from '@/app/components/signin';
import LogIn from '@/app/components/login';
import { useState } from 'react';
import { GoKey } from "react-icons/go";


function AuthPage() {
const [mode, setMode] = useState('signin');

function settingProps(route){

    setMode(route);

}

return (
    <div className="min-h-screen flex items-center justify-center text-primary bg-linear-to-b from-blue-700 via-blue-500 to-blue-300 p-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                    <GoKey className="text-white w-10 h-10" />
                </div>
                <h1 className="text-2xl font-semibold text-white">Password Manager</h1>
                <p className="text-sm text-white/80 mt-1">Securely store and manage your passwords</p>
            </div>

            <div className="flex items-center bg-white/5 rounded-full p-1 mb-6">
                <button
                    onClick={() => setMode('signin')}
                    className={`flex-1 text-sm py-2 rounded-full transition-colors ${
                        mode === 'signin' ? 'bg-white/10 text-white font-medium' : 'text-white/70'
                    }`}
                    aria-pressed={mode === 'signin'}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setMode('login')}
                    className={`flex-1 text-sm py-2 rounded-full transition-colors ${
                        mode === 'login' ? 'bg-white/10 text-white font-medium' : 'text-white/70'
                    }`}
                    aria-pressed={mode === 'login'}
                >
                    Log In
                </button>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
                {mode === 'signin' ? <SignIn func= {settingProps} /> : <LogIn />}
            </div>

            <p className="text-xs text-blue-500 text-center mt-4">
                By continuing you agree to the Terms of Service and Privacy Policy.
            </p>
        </div>
    </div>
)
}

export default AuthPage;