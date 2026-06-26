import { Link } from "wouter";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
          <Trophy className="text-primary w-8 h-8" />
          CHAMPION <span className="text-primary font-normal">SKILLS</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/register">
            <Button size="lg" className="font-bold tracking-wider shadow-[0_0_20px_rgba(106,27,255,0.4)] hover:shadow-[0_0_30px_rgba(106,27,255,0.6)] transition-all">
              REGISTER NOW
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
