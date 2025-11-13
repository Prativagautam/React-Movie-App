
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuth, login, signup, setAuthMode } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!authModalOpen) reset();
  }, [authModalOpen, reset]);

  if (!authModalOpen) return null;

  const onSubmit = (data) => {
    const userObj = { email: data.email, username: data.username || data.email };
    if (authMode === 'login') login(userObj);
    else signup(userObj);
    closeAuth();
    alert("Login Successfull")
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
        
        {/* Close Button */}
        <div className="flex justify-end p-6 pb-0">
          <button
            className="text-gray-400 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800/50 transition-all duration-200"
            onClick={closeAuth}
          >
            ×
          </button>
        </div>

        {/* Content Container with Padding */}
        <div className="px-12 pb-12 pt-4 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {authMode === 'login' 
                ? 'Please enter your credentials to continue' 
                : 'Sign up to get started with us'}
            </p>
          </div>

          {/* Form */}
          {/* <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-4 space-y-6 w-full max-w-sm"> */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-sm">

            {/* Username Field - Only for Signup */}
            {authMode === 'signup' && (
              <div>
                <input
                  {...register('username', { required: 'Username is required' })}
                  placeholder="     Username"
                  className="w-full px-6 py-5 bg-gray-800/50 text-white placeholder-gray-500 rounded-2xl border-2 border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-200 text-base"
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mt-2 ml-2">{errors.username.message}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                  },
                })}
                placeholder="   Email address"
                className="w-full px-6 py-5 bg-gray-800/50 text-white placeholder-gray-500 rounded-2xl border-2 border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-200 text-base"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 ml-2">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                placeholder="   Password"
                className="w-full px-6 py-5 bg-gray-800/50 text-white placeholder-gray-500 rounded-2xl border-2 border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-200 text-base"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 ml-2">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-200 text-base tracking-wide mt-8 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </button>
            <p></p>
          </form>

          {/* Switch Auth Mode */}
          <div className="text-center mt-8 w-full max-w-sm">
           <p className="text-gray-400 text-sm">
             {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
               <span> </span>
              <button
                type="button"
                className="text-blue-600 font-semibold hover:text-blue-300 transition-colors duration-200"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
             >
            {authMode === 'login' ? 'Sign up' : 'Login'}
            </button>
           </p>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center w-full max-w-sm">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our<br />
              <span className="text-gray-400">Terms of Service</span> and <span className="text-gray-400">Privacy Policy</span>
              <br />
              <p className="text-gray-900">   ..</p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


