import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Route ini sudah dinonaktifkan. Nomor WhatsApp sekarang dikelola lewat Supabase, bukan Firebase.",
    },
    { status: 410 }
  )
}
