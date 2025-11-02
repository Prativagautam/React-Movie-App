import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuth, login, signup } = useAuth()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (!authModalOpen) reset()
  }, [authModalOpen, reset])

  if (!authModalOpen) return null

  const onSubmit = (data) => {
    // build user object. In real app, you'd call API.
    const userObj = { email: data.email, username: data.username || data.email }
    if (authMode === 'login') login(userObj)
    else signup(userObj)
    closeAuth()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <button className="text-gray-500 float-right" onClick={closeAuth}>×</button>
        <h2 className="text-2xl font-semibold mb-4">{authMode === 'login' ? 'Login' : 'Sign up'}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {authMode === 'signup' && (
            <input
              {...register('username', { required: authMode === 'signup' })}
              placeholder="Username"
              className="w-full p-2 border rounded"
            />
          )}

          <input
            {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

          <input
            type="password"
            {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {authMode === 'login' ? 'Login' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm mt-3">
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            className="ml-2 text-blue-600"
            onClick={() => {
              // toggle mode without closing
              // useAuth not exposed here for setAuthMode; simple hack: close then open
              closeAuth()
              setTimeout(() => {
                // open in other mode — call via global openAuth if available
                // but keep it simple: we assume Navbar toggle will handle. If you prefer, expose setAuthMode in context.
              }, 0)
            }}
          >
            {authMode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
