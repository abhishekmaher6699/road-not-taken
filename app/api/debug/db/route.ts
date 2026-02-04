import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  const users = await prisma.user.findMany({
    take: 5,
  })

  return NextResponse.json({
    count: users.length,
    users,
  })
}
