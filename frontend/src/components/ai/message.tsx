"use client";

import { getInitials } from "@/lib/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/contexts/user-context";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { cn } from "@/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatStatus, UIMessage } from "ai";
import { LucideBot } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Markdown } from "@/components/markdown";
import { Overview } from "@/components/ai/overview";

interface MessagesContainerProps extends ComponentProps<"div"> {
  messages: UIMessage[];
  status: ChatStatus;
}

function MessagesContainer({
  messages,
  status,
  className,
  ...props
}: MessagesContainerProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className={cn("flex flex-col gap-3 px-4", className)}
      {...props}
    >
      {messages.length === 0 ? (
        <Overview />
      ) : (
        <>
          {messages.map((message, index) => {
            // Show loading spinner on the last assistant message when status is "submitted" or "streaming"
            const isLastAssistantMessage =
              index === messages.length - 1 &&
              message.role === "assistant" &&
              (status === "submitted" || status === "streaming");

            return (
              <Message
                key={message.id}
                message={message}
                isLoading={isLastAssistantMessage}
              />
            );
          })}
          {/* Show loading message for assistant when user just submitted and assistant hasn't responded yet */}
          {messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" &&
            status === "submitted" && (
              <Message
                message={{
                  id: "loading",
                  role: "assistant",
                  parts: [],
                }}
                isLoading={true}
              />
            )}
        </>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

type MessageProps = {
  message: UIMessage;
  isLoading?: boolean;
};

function Message({ message, isLoading = false }: MessageProps) {
  return (
    <div className="flex gap-2">
      <MessageAvatar role={message.role} />

      <div className="flex items-center gap-2">
        {message.parts.map((part, index) =>
          part.type === "text" ? (
            <Markdown key={index}>{part.text}</Markdown>
          ) : null,
        )}
        {isLoading && <Spinner className="text-muted-foreground size-4" />}
      </div>
    </div>
  );
}

interface MessageAvatarProps {
  role: UIMessage["role"];
}

function MessageAvatar({ role }: MessageAvatarProps) {
  const user = useUser();
  const initials = getInitials(user.login);

  if (role === "user") {
    return (
      <Avatar asChild>
        <Link href={`https://github.com/${user.login}`} target="_blank">
          {user.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt={`Avatar de ${user.login}`} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Link>
      </Avatar>
    );
  }

  return (
    <Avatar asChild>
      <Link href="/" target="_blank">
        <AvatarFallback>
          <LucideBot className="size-7" />
        </AvatarFallback>
      </Link>
    </Avatar>
  );
}

export { Message, MessagesContainer };
