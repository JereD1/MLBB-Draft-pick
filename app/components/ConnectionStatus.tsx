'use client';

import React from 'react';
import { useSocket } from '@/context/socketContext';
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectionStatus() {
  const { isConnected } = useSocket();

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Disconnected</span>
        </>
      )}
    </div>
  );
}
