import { NextResponse } from 'next/server';

// This should match the state storage from broadcast/route.ts
// In production, use a database instead of in-memory storage
let currentState: any = null;

export async function GET() {
  return NextResponse.json({ 
    state: currentState,
    timestamp: new Date().toISOString() 
  });
}