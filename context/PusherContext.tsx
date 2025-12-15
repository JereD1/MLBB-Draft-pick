'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Pusher from 'pusher-js';

interface PusherContextType {
  pusher: Pusher | null;
  isConnected: boolean;
  subscribe: (eventName: string, callback: (data: any) => void) => void;
  unsubscribe: (eventName: string, callback: (data: any) => void) => void;
  broadcast: (eventName: string, data: any) => Promise<void>;
}

const PusherContext = createContext<PusherContextType>({
  pusher: null,
  isConnected: false,
  subscribe: () => {},
  unsubscribe: () => {},
  broadcast: async () => {},
});

export function PusherProvider({ children }: { children: ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    console.log('🔌 Initializing Pusher...');
    console.log('📍 Key:', process.env.NEXT_PUBLIC_PUSHER_KEY);
    console.log('📍 Cluster:', process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

    // Enable Pusher logging for debugging
    Pusher.logToConsole = process.env.NODE_ENV === 'development';

    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channelInstance = pusherInstance.subscribe('draft-channel');

    channelInstance.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Pusher connected successfully!');
      setIsConnected(true);
    });

    channelInstance.bind('pusher:subscription_error', (error: any) => {
      console.error('❌ Pusher connection error:', error);
      setIsConnected(false);
    });

    pusherInstance.connection.bind('connected', () => {
      console.log('🔗 Pusher connection established');
      setIsConnected(true);
    });

    pusherInstance.connection.bind('disconnected', () => {
      console.log('⚠️ Pusher disconnected');
      setIsConnected(false);
    });

    pusherInstance.connection.bind('error', (error: any) => {
      console.error('🔴 Pusher connection error:', error);
      setIsConnected(false);
    });

    setPusher(pusherInstance);
    setChannel(channelInstance);

    return () => {
      console.log('🛑 Cleaning up Pusher connection...');
      channelInstance.unbind_all();
      pusherInstance.unsubscribe('draft-channel');
      pusherInstance.disconnect();
    };
  }, []);

  const subscribe = (eventName: string, callback: (data: any) => void) => {
    if (channel) {
      console.log('📡 Subscribing to:', eventName);
      channel.bind(eventName, callback);
    } else {
      console.warn('⚠️ Cannot subscribe - channel not ready');
    }
  };

  const unsubscribe = (eventName: string, callback: (data: any) => void) => {
    if (channel) {
      console.log('📴 Unsubscribing from:', eventName);
      channel.unbind(eventName, callback);
    }
  };

  const broadcast = async (eventName: string, data: any) => {
    console.log('📤 Broadcasting:', eventName);
    
    try {
      const response = await fetch('/api/pusher/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to broadcast event');
      }

      console.log('✅ Broadcast successful');
    } catch (error) {
      console.error('❌ Broadcast failed:', error);
    }
  };

  return (
    <PusherContext.Provider value={{ pusher, isConnected, subscribe, unsubscribe, broadcast }}>
      {children}
    </PusherContext.Provider>
  );
}

export function usePusher() {
  return useContext(PusherContext);
}