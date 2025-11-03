"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Overview() {
  return (
    <div className="mx-auto mt-10 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Unicamp VestIA
          </CardTitle>
          <CardDescription>
            Tire suas dúvidas sobre o Vestibular Unicamp 2026
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground prose prose-sm">
          <p>
            Este chat usa IA para te ajudar com perguntas sobre o edital do
            Vestibular Unicamp 2026.
          </p>
          <ul>
            <li>Login fácil com GitHub</li>
            <li>Compreensão profunda de linguagem natural</li>
            <li>Respostas compreensíveis e rápidas</li>
          </ul>
          <p>Obrigado por usar o Unicamp VestIA!</p>
        </CardContent>
      </Card>
    </div>
  );
}

export { Overview };
