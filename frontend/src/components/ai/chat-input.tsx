"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LucideArrowUp, LucideStopCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import type { ChatStatus } from "ai";

type ChatInputProps = {
  status: ChatStatus;
  onSubmit: (text: string) => void;
  stop: () => void;
};

function ChatInput({ status, onSubmit, stop }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      void onSubmit(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed bottom-0 mb-8 w-full max-w-xl px-4">
        <InputGroup className="bg-background">
          <InputGroupInput
            placeholder="Pergunte, busque ou converse..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={status !== "ready"}
            autoFocus
          />
          <InputGroupAddon align="inline-end">
            {status === "ready" && (
              <InputGroupButton
                type="submit"
                variant="default"
                className="rounded-full"
                size="icon-xs"
                disabled={!input.trim()}
              >
                <LucideArrowUp />
                <span className="sr-only">Enviar</span>
              </InputGroupButton>
            )}
            {status === "submitted" && (
              <InputGroupButton
                variant="default"
                className="rounded-full"
                size="icon-xs"
                disabled
              >
                <Spinner />
                <span className="sr-only">Enviando...</span>
              </InputGroupButton>
            )}
            {status === "streaming" && (
              <InputGroupButton
                variant="default"
                className="rounded-full"
                size="icon-xs"
                onClick={() => stop()}
              >
                <LucideStopCircle />
                <span className="sr-only">Parar</span>
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>
    </form>
  );
}

export { ChatInput };
