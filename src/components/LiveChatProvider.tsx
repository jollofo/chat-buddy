'use client';
import { useEffect, PropsWithChildren } from 'react';
import { ThemeProvider } from '@livechat/ui-kit';
import { getCustomerSDK } from '@/lib/livechat';

export default function LiveChatProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const sdk = getCustomerSDK();
    const handler = (e: any) => {
      // Fan-out every RTM event to backend for persistence
      fetch('/api/chat/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e)
      });
    };
    sdk.on('new_event', handler);
    return () => sdk.off('new_event', handler);
  }, []);
  return <ThemeProvider>{children}</ThemeProvider>;
}