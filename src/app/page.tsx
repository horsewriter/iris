'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }

    if (status === 'authenticated' && session?.user?.role) {
      switch (session.user.role) {
        case 'ADMIN':
          router.push('/general/dashboard')
          break
        case 'HR':
          router.push('http://localhost:3000/hr/dashboard')
          break
        case 'MANAGER':
          router.push('http://localhost:3000/general/dashboard')
          break
        case 'EMPLOYEE':
          router.push('http://localhost:3000/general/dashboard')
          break
        default:
          router.push('/auth/signin')
      }
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    )
  }

  return <>{children}</>
}
