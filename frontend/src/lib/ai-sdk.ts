import { DefaultChatTransport } from "ai";

export function createFastapiChatTransport() {
  return new DefaultChatTransport({
    api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
    credentials: "include",
    // Only send the last message to the server
    prepareSendMessagesRequest({ messages, id }) {
      return {
        body: {
          message: messages[messages.length - 1],
          id,
        },
      };
    },
  });
}
