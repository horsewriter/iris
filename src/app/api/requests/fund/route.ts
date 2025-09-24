import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  const res = await fetch("http://localhost:8080/fund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": session.user.id,
      "x-user-role": session.user.role,
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function GET() {
  const res = await fetch("http://localhost:8080/fund")
  const data = await res.json()
  return NextResponse.json(data)
}
