"use client";

import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-50">
      <AuthCard
        title="Dashboard"
        description="Welcome to the Concert Ticketing Platform!"
        footer={null}
      >
        <div className="space-y-4 text-center">
          <p className="text-zinc-600">You have successfully logged in.</p>
          <Button 
            onClick={() => router.push("/auth/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            Log Out
          </Button>
        </div>
      </AuthCard>
    </div>
  );
}
