"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

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

    try {
      let isoDate = undefined;
      if (formData.dateOfBirth) {
        const d = new Date(formData.dateOfBirth);
        if (!isNaN(d.getTime())) {
          isoDate = d.toISOString();
        }
      }

      const response = await api.post("/auth/register", {
        ...formData,
        dateOfBirth: isoDate,
      });

      console.log("Registration successful", response.data);
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Registration failed. Please check your details.");
      } else {
        setError("An unexpected network error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      description="Sign up to start buying tickets."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-zinc-500 font-normal">First name</Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={handleChange}
              className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-zinc-500 font-normal">Last name (optional)</Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={handleChange}
              className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors"
              required 
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-zinc-500 font-normal">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors"
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-zinc-500 font-normal">Phone number</Label>
            <Input 
              id="phoneNumber" 
              type="tel" 
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth" className="text-zinc-500 font-normal">Date of birth</Label>
            <Input 
              id="dateOfBirth" 
              type="date" 
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="border-zinc-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-none transition-colors w-full cursor-pointer"
              onClick={(e) => {
                try {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                  }
                } catch (err) {}
              }}
              required 
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-zinc-500 font-normal">Password</Label>
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
