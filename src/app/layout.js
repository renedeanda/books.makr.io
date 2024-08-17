
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeContext'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Book Recommendation App',
  description: 'Discover your next favorite book with our personalized recommendation system.',
  metadataBase: new URL('https://books.makr.io'),
  keywords: 'books, reading, recommendations, literature',
  author: 'Your Name',
  openGraph: {
    title: 'Book Recommendation App',
    description: 'Find your next great read with our book recommendation app.',
    images: [{ url: '/og-image.jpg' }],
    url: 'https://books.makr.io',
    siteName: 'Book Recommendation App',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Recommendation App',
    description: 'Find your next great read with our book recommendation app.',
    creator: '@your_twitter_handle',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
