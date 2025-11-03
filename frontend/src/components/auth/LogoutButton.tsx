"use client";

import { LucideLoader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="flex w-full items-center gap-1 text-left">
      {pending ? <LucideLoader2 className="size-4 animate-spin" /> : null}
      Sair
    </button>
  );
}

export { LogoutButton };
