'use client';

import dynamic from 'next/dynamic';

const BookRecommendationApp = dynamic(() => import('@/components/BookRecommendationApp'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <BookRecommendationApp />
    </main>
  );
}