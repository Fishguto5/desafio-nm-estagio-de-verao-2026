"use server";

import { redirect } from "next/navigation";

export async function logout() {
  redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
}
