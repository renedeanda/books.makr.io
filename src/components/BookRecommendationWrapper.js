'use client';

import { useSearchParams } from 'next/navigation';
import BookRecommendationApp from './BookRecommendationApp';

export default function BookRecommendationWrapper({ initialQuery }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || initialQuery;

  return <BookRecommendationApp initialQuery={query} />;
}
