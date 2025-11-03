import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="absolute inset-0 flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">
            Página não encontrada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
