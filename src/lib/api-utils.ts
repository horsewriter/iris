import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { Role } from '@prisma/client'

export async function getAuthenticatedUser(req: NextRequest) {
  try {
    // Método alternativo: extraer token JWT de las cookies
    const cookieHeader = req.headers.get('cookie')
    console.log('Cookie header:', cookieHeader)
    
    // Primero intentamos con getServerSession
    const session = await getServerSession(authOptions)
    console.log('Session from getServerSession:', session)
    
    if (!session?.user) {
      console.log('No session found via getServerSession')
      
      // Si no hay sesión, verificar si hay cookies de NextAuth
      if (!cookieHeader || !cookieHeader.includes('next-auth')) {
        console.log('No NextAuth cookies found')
        throw new Error('Unauthorized')
      }
      
      throw new Error('Unauthorized')
    }
    
    console.log('User authenticated successfully:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      hasEmployee: !!session.user.employee,
      employeeId: session.user.employee?.id
    })
    
    return session.user
  } catch (error) {
    console.error('Authentication error:', error)
    throw new Error('Unauthorized')
  }
}

export function requireRole(userRole: Role, requiredRoles: Role[]) {
  if (!requiredRoles.includes(userRole)) {
    throw new Error('Insufficient permissions')
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status })
}

export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(data, { status })
}