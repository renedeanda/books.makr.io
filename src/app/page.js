import { Suspense } from 'react';
import BookRecommendationWrapper from '@/components/BookRecommendationWrapper';

export default function Home({ searchParams }) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <BookRecommendationWrapper initialQuery={searchParams.q || ''} />
      </Suspense>
    </main>
  );
}