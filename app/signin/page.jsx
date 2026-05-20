'use client';

import { signIn } from "next-auth/react";
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
      

        <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mb-6">
          <LogIn className="text-violet-500" size={40} />
        </div>

        <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8">
          Sign in to your vault.
        </p>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98]"
        >
          <span className="text-lg">Sign in with Google</span>
        </button>

        <p className="text-gray-500 text-sm mt-6 text-center">
          By signing in, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}