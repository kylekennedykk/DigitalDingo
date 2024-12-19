'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon
} from 'lucide-react'
import { db } from '@/lib/firebase/index'
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  type DocumentData 
} from 'firebase/firestore'
import { LoadingPage } from '@/components/ui/loading-states'
import { createErrorMessage } from '@/lib/utils/error'
import { signIn } from '@/lib/auth'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  chatSessions: number
  averageSessionDuration: number
  portfolioViews: number
  contactSubmissions: number
  // Add more metrics as needed
}

interface TimelineData {
  date: string
  pageViews: number
  uniqueVisitors: number
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [timelineData, setTimelineData] = useState<TimelineData[]>([])

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Check authentication
        if (!user) {
          setError('You must be logged in to view analytics')
          setLoading(false)
          return
        }

        // Check admin status
        const token = await user.getIdTokenResult()
        if (!token.claims.admin) {
          setError('You must be an admin to view analytics')
          setLoading(false)
          return
        }

        // Fetch analytics data
        const analyticsRef = collection(db, 'analytics')
        const timelineRef = collection(db, 'analytics_timeline')
        
        // Get latest analytics snapshot
        const snapshot = await getDocs(query(analyticsRef, orderBy('timestamp', 'desc'), limit(1)))
        const latestData = snapshot.docs[0]?.data() as AnalyticsData
        
        // Get timeline data
        const timelineSnapshot = await getDocs(
          query(timelineRef, orderBy('date', 'desc'), limit(30))
        )
        const timeline = timelineSnapshot.docs.map(doc => ({
          date: doc.id,
          ...doc.data()
        })) as TimelineData[]

        setData(latestData)
        setTimelineData(timeline)
        setError(null)
      } catch (err) {
        console.error('Error:', err)
        setError(createErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchAnalytics()
    }
  }, [user, authLoading])

  // Show auth loading state
  if (authLoading) {
    return <LoadingPage />
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        {!user && (
          <button 
            onClick={() => signIn()}
            className="px-4 py-2 bg-primary-ochre text-white rounded-lg"
          >
            Sign In
          </button>
        )}
      </div>
    )
  }

  if (loading) return <LoadingPage />
  if (!data) return <div className="p-4">No analytics data available</div>

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl">Analytics Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Page Views"
          value={data.pageViews}
          icon={Eye}
          trend={10} // Calculate actual trend
        />
        <MetricCard
          title="Unique Visitors"
          value={data.uniqueVisitors}
          icon={Users}
          trend={5}
        />
        <MetricCard
          title="Chat Sessions"
          value={data.chatSessions}
          icon={MessageSquare}
          trend={-2}
        />
        <MetricCard
          title="Avg. Session Duration"
          value={`${Math.round(data.averageSessionDuration / 60)}m`}
          icon={Clock}
          trend={3}
        />
        <MetricCard
          title="Portfolio Views"
          value={data.portfolioViews}
          icon={BarChart3}
          trend={7}
        />
        <MetricCard
          title="Contact Submissions"
          value={data.contactSubmissions}
          icon={MessageSquare}
          trend={0}
        />
      </div>

      {/* Timeline Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-heading text-xl mb-6">Traffic Overview</h2>
        <div className="h-[400px]">
          {/* Add your preferred charting library here */}
          {/* Example: Recharts, Chart.js, etc. */}
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend: number
}

function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : null
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-neutral-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-500" />
        </div>
        {TrendIcon && (
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-neutral-600 mb-1">{title}</h3>
      <div className="text-2xl font-semibold">{value}</div>
    </motion.div>
  )
} 