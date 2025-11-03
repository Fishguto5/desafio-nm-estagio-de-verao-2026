import { Button } from "@/components/ui/button";
import Link from "next/link";

function LoginButton() {
  return (
    <Button asChild>
      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/login`}>
        Entrar com GitHub
      </Link>
    </Button>
  );
}

export { LoginButton };
