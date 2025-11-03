"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideRefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive text-4xl font-bold">
            500
          </CardTitle>
          <CardDescription className="text-lg">Algo deu errado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          {error.message && (
            <p className="text-muted-foreground bg-muted rounded p-2 font-mono text-sm">
              {error.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset}>
            <LucideRefreshCcw className="size-4" /> Tentar novamente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
