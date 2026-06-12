import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from '@/components/auth-card';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const footer = (
    <Link 
      href="/auth/login" 
      className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to sign in
    </Link>
  );

  return (
    <AuthCard 
      title="Reset password" 
      description="Enter your email address and we'll send you a link to reset your password."
      footer={footer}
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Email address
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            className="h-10 border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 bg-white dark:bg-zinc-950"
            required 
          />
        </div>
        <Button className="w-full h-10 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm">
          Send reset link
        </Button>
      </div>
    </AuthCard>
  );
}
