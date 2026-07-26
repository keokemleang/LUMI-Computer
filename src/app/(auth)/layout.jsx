import Link from "next/link";
import { Cpu } from "lucide-react";
export default function AuthLayout({
  children
}) {
  return <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="text-xl tracking-tight">LUMI Computer</span>
        </Link>
        {children}
      </div>
    </div>;
}
