'use client';

import { useRouter } from 'next/navigation';
import TripInputCard from '@/components/TripInputCard'; // Cursor will help fix this import path

export default function Home() {
  const router = useRouter();

  const handleGenerate = () => {
    // This is the "Fake AI" delay to make it feel real
    setTimeout(() => {
      router.push('/itinerary'); // Redirects to the results page
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      
      {/* Hero Text */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
          DuoCore <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Your personal travel architect.
        </p>
      </div>

      {/* The Component You Just Built */}
      <TripInputCard onGenerate={handleGenerate} />

      {/* Footer / Social Proof */}
      <p className="mt-8 text-sm text-slate-400">
        Powered by TiDB & Vercel AI SDK
      </p>
    </main>
  );
}
