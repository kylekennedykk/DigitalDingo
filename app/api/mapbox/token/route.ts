import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      token: process.env.MAPBOX_TOKEN 
    })
  } catch (error) {
    console.error('MapBox token error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 