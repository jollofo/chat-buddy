import ChatShell from '@/components/ChatShell';
import LiveChatProvider from '@/components/LiveChatProvider';
export default function ChatPage(){
  return (
    <LiveChatProvider>
      <main className="max-w-2xl mx-auto p-6">
        <ChatShell />
      </main>
    </LiveChatProvider>
  );
}