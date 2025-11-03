import { Toaster } from "@/components/ui/sonner";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type AppProps = ComponentProps<"div">;

function App({ children, className, ...props }: AppProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)} {...props}>
      <Toaster position="top-center" />
      {children}
    </div>
  );
}

export { App };

type AppHeaderProps = ComponentProps<"header">;

function AppHeader({ children, className, ...props }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b p-4",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}

export { AppHeader };

type AppHeaderTitleProps = ComponentProps<"h1"> & { asChild?: boolean };

function AppHeaderTitle({
  children,
  asChild = false,
  className,
  ...props
}: AppHeaderTitleProps) {
  const Comp = asChild ? Slot : "h1";
  return (
    <Comp className={cn("text-xl font-bold", className)} {...props}>
      {children}
    </Comp>
  );
}

export { AppHeaderTitle };

type AppHeaderActionsProps = ComponentProps<"div">;

function AppHeaderActions({
  children,
  className,
  ...props
}: AppHeaderActionsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export { AppHeaderActions };

type AppMainProps = ComponentProps<"main">;

function AppMain({ children, className, ...props }: AppMainProps) {
  return (
    <main className={cn("flex flex-1 flex-col", className)} {...props}>
      {children}
    </main>
  );
}

export { AppMain };
