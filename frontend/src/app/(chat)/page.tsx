import { createChat } from "@/lib/api/ai";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const chatId = await createChat();
  redirect(`/chat/${chatId.id}`);
}
