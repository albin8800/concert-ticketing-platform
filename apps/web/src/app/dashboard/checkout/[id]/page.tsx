"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const router = useRouter();
  const { id: reservationId } = useParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use a dummy payment ID for the mock transaction
      const paymentId = `pay_${Math.random().toString(36).substring(7)}`;

      const response = await api.post('/booking/checkout', {
        reservationId: reservationId,
        paymentId: paymentId
      });

      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setError(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please check your details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white p-10 rounded-2xl border border-zinc-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Payment Successful!</h1>
        <p className="text-zinc-500 mb-8">
          Your booking has been confirmed and your ticket is ready. We've sent a confirmation email to you.
        </p>
        <Link href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
          View My Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <Link href="/dashboard/events" className="inline-flex items-center text-sm text-zinc-500 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
        <div className="bg-zinc-50 border-b border-zinc-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Checkout</h1>
            <p className="text-sm text-zinc-500 mt-1">Complete your payment to confirm your seat.</p>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-medium">Secure Checkout</span>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Name on Card</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full border border-zinc-300 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Expiry Date</label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">CVV</label>
                <input
                  type="text"
                  required
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors flex justify-center items-center disabled:opacity-50"
              >
                {isProcessing ? 'Processing Payment...' : 'Pay Now to Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
