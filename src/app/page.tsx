'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Globe, Share2, Link } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

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
      if (email === 'student@stalford.edu') {
        router.push('/student/home');
      } else {
        router.push('/tutor/home');
      }
    } else {
      setError('Invalid email or password. Try student@stalford.edu or tutor@stalford.edu with password123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">S</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-sm">Stalford</span>
            <span className="text-yellow-500 font-bold text-sm"> Learning</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">Academic Level</a>
          <a href="#" className="hover:text-gray-900">Crash Course</a>
          <a href="#" className="hover:text-gray-900 font-semibold text-yellow-600">Learning Management System</a>
          <a href="#" className="hover:text-gray-900">About</a>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-gray-500">
            <a href="#" className="hover:text-blue-600"><Globe size={16} /></a>
            <a href="#" className="hover:text-pink-600"><Share2 size={16} /></a>
            <a href="#" className="hover:text-red-600"><Link size={16} /></a>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            Enrol Now
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left: Classroom Image Placeholder */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-700 to-gray-900 flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent" />
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-6xl">🎓</span>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">
              Welcome to Stalford EduCore
            </h2>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Your personalized learning journey starts here. Access worksheets, track progress, and achieve excellence.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-yellow-400 text-2xl font-bold">500+</p>
                <p className="text-gray-300 text-xs mt-1">Students</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-yellow-400 text-2xl font-bold">50+</p>
                <p className="text-gray-300 text-xs mt-1">Tutors</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-yellow-400 text-2xl font-bold">95%</p>
                <p className="text-gray-300 text-xs mt-1">Pass Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">S</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-xl leading-none">Stalford</p>
                  <p className="text-gray-500 text-xs">Learning Centre</p>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Sign in to EduCore</h1>
              <p className="text-gray-500 text-sm mt-1">Access your learning dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative bg-white px-4">
                  <span className="text-gray-500 text-sm">Not part of our family?</span>
                </div>
              </div>
              <a
                href="#"
                className="mt-4 block w-full border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                Apply Now
              </a>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Demo: student@stalford.edu / tutor@stalford.edu — password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
