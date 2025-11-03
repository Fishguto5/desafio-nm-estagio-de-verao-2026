import { Spinner } from "@/components/ui/spinner";

export default function ChatLoading() {
  return (
    <div className="absolute inset-0 flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}
