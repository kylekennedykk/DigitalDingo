'use client'

import Link from 'next/link'
import { MessageSquare, LayoutGrid, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link 
        href="/admin/contacts"
        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4 mb-4">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">Contact Submissions</h2>
        </div>
        <p className="text-neutral-600">
          View and manage contact form submissions
        </p>
      </Link>

      <Link 
        href="/admin/portfolio"
        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4 mb-4">
          <LayoutGrid className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">Portfolio Sites</h2>
        </div>
        <p className="text-neutral-600">
          Manage portfolio showcase websites
        </p>
      </Link>

      <Link 
        href="/admin/analytics"
        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">Analytics</h2>
        </div>
        <p className="text-neutral-600">
          View website analytics and performance
        </p>
      </Link>
    </div>
  )
}
