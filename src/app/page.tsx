'use client';

import { useState } from 'react';
import LiveChatProvider from '@/components/LiveChatProvider';
import PreChatForm from '@/components/PreChatForm';
import ChatShell from '@/components/ChatShell';

export default function Home() {
  const [started, setStarted] = useState(false);
  return (
    <LiveChatProvider>
      <main className="max-w-2xl mx-auto p-6">
        {!started ? (
          <section>
            <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
            <p className="mb-4">Fill the pre-chat form to begin.</p>
            <PreChatForm onReady={() => setStarted(true)} />
          </section>
        ) : (
          <section>
            <h2 className="text-xl font-semibold mb-2">You’re connected</h2>
            <ChatShell />
          </section>
        )}
      </main>
    </LiveChatProvider>
  );
}