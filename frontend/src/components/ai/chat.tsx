"use client";

import { ChatInput } from "@/components/ai/chat-input";
import { MessagesContainer } from "@/components/ai/message";
import { createFastapiChatTransport } from "@/lib/ai-sdk";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { LucideInfo } from "lucide-react";
import { toast } from "sonner";

interface ChatProps {
  id: string;
  initialMessages?: UIMessage[];
}

export default function Chat({ id, initialMessages }: ChatProps) {
  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: initialMessages ?? [],
    transport: createFastapiChatTransport(),
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao processar mensagem.");
    },
  });

  return (
    <div className="stretch mx-auto mt-8 flex w-full max-w-xl flex-col pb-24">
      <Info />

      <MessagesContainer
        messages={messages}
        status={status}
        className="mt-10"
      />

      <ChatInput
        status={status}
        onSubmit={(text) => sendMessage({ text })}
        stop={stop}
      />
    </div>
  );
}

const Info = () => {
  return (
    <div className="text-muted-foreground mx-auto flex items-center gap-2 px-4">
      <LucideInfo className="size-4" />
      <p className="text-sm">Salve este link para continuar depois.</p>
    </div>
  );
};

export { Chat };
