'use client';

import React, { Suspense } from 'react';
import BookRecommendationApp from '@/components/BookRecommendationApp';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Suspense fallback={<div>Loading application...</div>}>
        <BookRecommendationApp />
      </Suspense>
    </main>
  );
}