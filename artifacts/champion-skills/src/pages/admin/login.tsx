import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Lock } from "lucide-react";
import { Link } from "wouter";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    loginMutation.mutate({ data: { password } }, {
      onSuccess: (res) => {
        if (res.success) {
          toast({ title: "Login Successful", description: "Welcome back, Coach." });
          setLocation("/admin/dashboard");
        } else {
          toast({ variant: "destructive", title: "Login Failed", description: res.message || "Invalid password." });
        }
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Something went wrong. Try again." });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white mb-8">
        <Trophy className="text-primary w-8 h-8" />
        CHAMPION <span className="text-primary font-normal">SKILLS</span>
      </Link>

      <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">Admin Access</CardTitle>
          <CardDescription>Enter the master password to view registrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-background border-border/50 text-center text-lg tracking-widest"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 font-bold tracking-wider shadow-[0_0_20px_rgba(106,27,255,0.2)]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "VERIFYING..." : "ENTER DASHBOARD"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
