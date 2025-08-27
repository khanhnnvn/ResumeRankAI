import { Logo } from "@/components/app/logo";
import { AuthButton } from "@/hooks/use-auth";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 border-b bg-card shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              ResumeRank AI
            </h1>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}
