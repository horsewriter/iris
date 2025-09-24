import { getToken } from 'next-auth/jwt'
import { NextApiRequest } from 'next'

export async function getAuthToken(req: NextApiRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return token
}
