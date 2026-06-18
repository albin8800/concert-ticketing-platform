import React from 'react';
import Link from 'next/link';
import { Music2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      {/* Centered Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 transition-transform hover:scale-105">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shadow-sm">
          <Music2 className="h-4 w-4 text-white" />
        </div>
        <span className="text-xl font-semibold text-zinc-900">
          Lumina
        </span>
      </Link>

      {/* Main Auth Container */}
      <main className="w-full max-w-sm">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Lumina
        </p>
      </footer>
    </div>
  );
}
