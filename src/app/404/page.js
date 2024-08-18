// app/404/page.js
'use client';

import React, { Suspense } from 'react';

export default function Custom404() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
      <Suspense fallback={<div>Loading 404 page...</div>}>
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="mt-4">The page you are looking for does not exist.</p>
        </div>
      </Suspense>
    </main>
  );
}
