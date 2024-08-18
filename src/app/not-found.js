'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! The page you\'re looking for doesn\'t exist.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
}