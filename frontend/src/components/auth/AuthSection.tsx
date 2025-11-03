import { LoginButton } from "@/components/auth/LoginButton";
import { ProfileDropdownMenu } from "@/components/auth/ProfileDropdownMenu";
import { getUser } from "@/lib/api/auth";

async function AuthSection() {
  const user = await getUser();

  if (!user) {
    return <LoginButton />;
  }

  return <ProfileDropdownMenu user={user} />;
}

export { AuthSection };
