import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// In-memory state storage (use database in production)
let currentState: any = null;

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();
    
    console.log('📡 Broadcasting event:', event);
    
    // Store state if it's a draft update
    if (event === 'draft:update' && data.state) {
      currentState = data.state;
    }
    
    // Reset state if it's a reset event
    if (event === 'draft:reset') {
      currentState = null;
    }
    
    // Broadcast to all connected clients
    await pusher.trigger('draft-channel', event, data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Broadcast error:', error);
    return NextResponse.json({ success: false, error: 'Failed to broadcast' }, { status: 500 });
  }
}