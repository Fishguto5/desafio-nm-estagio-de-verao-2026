"use client";

import type { UserCreated } from "@/lib/api-client.gen";
import React, { createContext, useContext } from "react";

type UserContextValue = {
  user: UserCreated;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  user: UserCreated;
  children: React.ReactNode;
};

function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

function useUser<T = UserCreated>() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx.user as T;
}

export { UserProvider, useUser };
