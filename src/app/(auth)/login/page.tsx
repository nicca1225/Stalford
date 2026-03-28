'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      router.push(email === 'student@stalford.edu' ? '/student/home' : '/tutor/home');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Full-width Navbar ── */}
      <nav className="h-16 bg-white border-b border-gray-100 grid grid-cols-3 items-center px-8 flex-shrink-0 z-10">
        {/* Logo — left col */}
        <div>
          <p className="font-bold text-gray-900 text-sm tracking-wide leading-none">STALFORD</p>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">Learning Centre</p>
        </div>

        {/* Center links — middle col, truly centered */}
        <div className="flex items-center justify-center gap-8">
          {['Academic Level', 'Crash Course', 'Learning Management System', 'About'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: social + CTA — right col */}
        <div className="flex items-center gap-4 justify-end">
          <div className="flex items-center gap-3 text-gray-500">
            <a href="#" className="hover:text-pink-500 transition-colors" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" className="hover:text-black transition-colors" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
          <button className="bg-[#FFC107] hover:bg-yellow-500 text-black font-semibold text-sm px-5 py-2 rounded-lg transition-colors">
            Enrol Now
          </button>
        </div>
      </nav>

      {/* ── 50/50 Split ── */}
      <div className="flex flex-1">

        {/* Left — classroom placeholder */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-700/80" />
          {/* decorative content keeps the panel interesting */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFC107] flex items-center justify-center mb-6 shadow-2xl">
              <span className="text-4xl">🎓</span>
            </div>
            <h2 className="text-white text-3xl font-bold mb-3">Stalford EduCore</h2>
            <p className="text-gray-300 text-base max-w-xs leading-relaxed">
              Your personalised AI-powered learning platform. Track progress, ace worksheets, and grow every day.
            </p>
            <div className="mt-10 flex gap-4">
              {[['500+', 'Students'], ['50+', 'Tutors'], ['95%', 'Pass Rate']].map(([val, label]) => (
                <div key={label} className="bg-white/10 backdrop-blur rounded-xl px-5 py-4 text-center">
                  <p className="text-[#FFC107] text-xl font-bold">{val}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — login form */}
        <div className="flex-1 lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Login</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    required
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#FFC107] hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-sm transition-colors"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400 whitespace-nowrap">Not part of our family?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Apply Now */}
            <p className="text-center font-bold text-gray-900 text-sm cursor-pointer hover:text-yellow-600 transition-colors">
              Apply Now
            </p>

            {/* Demo hint */}
            <p className="text-center text-xs text-gray-400 mt-8">
              student@stalford.edu · tutor@stalford.edu · password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
