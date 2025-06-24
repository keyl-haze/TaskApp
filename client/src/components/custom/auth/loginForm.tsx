'use client'

import type React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from '@/lib/actions/auth'
import {
  showErrorToast,
  showSuccessToast
} from '@/components/custom/utils/errorSonner'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(formData)
      showSuccessToast('Login successful!')
    } catch (error) {
      console.error('Login error:', error)
      showErrorToast(
        'Login failed. Please check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <Input
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((f) => ({ ...f, email: e.target.value }))
              }
              required
              className="h-12 bg-gray-100 border-0 rounded-lg px-4 text-gray-700 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((f) => ({ ...f, password: e.target.value }))
              }
              required
              className="h-12 bg-gray-100 border-0 rounded-lg px-4 pr-12 text-gray-700 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Recover Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Recover Password ?
            </a>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600">
          {"Don't have an account yet? "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Create an Account
          </a>
        </div>
      </div>
    </div>
  )
}
