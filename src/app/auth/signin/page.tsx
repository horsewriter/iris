'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import Image from 'next/image'
import { Role } from '@prisma/client'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        const session = await getSession()

        if (session?.user?.role) {
          const role = session.user.role as Role

          switch (role) {
            case Role.HR:
              router.push('/hr/dashboard')
              break
            case Role.MANAGER:
              router.push('/general/dashboard')
              break
            case Role.PAYROLL:
              router.push('/payroll/dashboard')
              break
            default:
              router.push('/general/dashboard')
              break
          }
        } else {
          setError('User role not found')
        }
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3">
            <Image
              src="/logo.png"
              alt="Impro Aerospace"
              width={180}
              height={80}
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Welcome</h1>
          <p className="text-sm text-gray-500">HR Information System</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        {/* Email Input */}
        <div className="mb-4 relative">
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              className="w-full border p-2 pl-10 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6 relative">
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              className="w-full border p-2 pl-10 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
