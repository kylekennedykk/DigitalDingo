import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-red-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-900 mb-4">Page Not Found</h2>
        <p className="text-red-800 mb-6">The page you're looking for doesn't exist.</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 