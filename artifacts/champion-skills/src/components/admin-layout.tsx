import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useGetAdminMe } from "@workspace/api-client-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading, error } = useGetAdminMe();

  useEffect(() => {
    if (!isLoading && (error || !admin?.authenticated)) {
      setLocation("/admin");
    }
  }, [admin, isLoading, error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
