import { Chat } from "@/components/ai/chat";
import { getChatMessages } from "@/lib/api/ai";
import type { UIMessage } from "ai";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const data = await getChatMessages(id);

  return <Chat id={id} initialMessages={data.messages as UIMessage[]} />;
}
