"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If redirected from registration, show a success banner
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await api.post("/auth/login", formData);
      
      console.log("Login successful", response.data);
      // Assuming the backend sends a token or sets a secure cookie.
      // If it sends a token, you might want to store it in localStorage here:
      // localStorage.setItem("accessToken", response.data.accessToken);

      router.push("/dashboard");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password.");
      } else {
        setError("An unexpected network error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account."
      footer={
        <>
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign up
          </Link>
        </>
      }
    >
      {successMsg && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-zinc-500 font-normal">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com" 
            className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors"
            required 
          />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-zinc-500 font-normal">Password</Label>
            <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={formData.password}
            onChange={handleChange}
            className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors"
            required 
          />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md h-10 shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
