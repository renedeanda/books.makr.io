import { Suspense } from 'react';
import BookRecommendationApp from '@/components/BookRecommendationApp';

function SearchParamsWrapper({ children }) {
  return children;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper>
          {(searchParams) => (
            <BookRecommendationApp initialQuery={searchParams?.get('q') || ''} />
          )}
        </SearchParamsWrapper>
      </Suspense>
    </main>
  );
}