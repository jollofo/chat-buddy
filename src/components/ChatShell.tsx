'use client';
import { useState } from 'react';
import { useSnapcall } from '@/hooks/useSnapcall';

export default function ChatShell() {
  const [showCall, setShowCall] = useState(true); // toggle via agent events if desired
  const snapReady = useSnapcall(process.env.NEXT_PUBLIC_SNAPCALL_KEY as string, 'callNow');
  return (
    <div className="space-y-4">
      {showCall && (
        <button id="callNow" className="px-4 py-2 rounded border">{snapReady ? 'Call Now' : 'Loading Call…'}</button>
      )}
      {/* Mount your preferred chat UI or leave minimal shell if using native widget surfaces */}
      <div className="border rounded p-4">
        <p className="text-sm opacity-80">Chat is active. Messages stream to the backend via RTM → /api/chat/event.</p>
      </div>
    </div>
  );
}