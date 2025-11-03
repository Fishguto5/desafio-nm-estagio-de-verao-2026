import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserCreated } from "@/lib/api-client.gen";
import { LogoutButton } from "./LogoutButton";
import { logout } from "@/actions/auth";
import { getInitials } from "@/lib/ui/avatar";

interface ProfileDropdownMenuProps {
  user: UserCreated;
}

function ProfileDropdownMenu({ user }: ProfileDropdownMenuProps) {
  const initials = getInitials(user.login);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Avatar className="size-5">
            {user.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.login} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{user.login}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <form action={logout} className="w-full">
            <LogoutButton />
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ProfileDropdownMenu };
