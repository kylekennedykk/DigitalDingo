import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const aggregateAnalytics = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore()
    const analytics = admin.analytics()

    try {
      // Get yesterday's date
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateString = yesterday.toISOString().split('T')[0]

      // Fetch analytics data
      const analyticsData = await analytics.getAnalyticsData({
        startDate: dateString,
        endDate: dateString,
        metrics: [
          'screenPageViews',
          'totalUsers',
          'userEngagementDuration',
          'conversions'
        ],
        dimensions: ['date']
      })

      // Aggregate data
      const aggregatedData = {
        date: dateString,
        pageViews: analyticsData[0].metrics[0],
        uniqueVisitors: analyticsData[0].metrics[1],
        averageSessionDuration: analyticsData[0].metrics[2],
        // Add more metrics
      }

      // Save to Firestore
      await db.collection('analytics_timeline').doc(dateString).set(aggregatedData)
      await db.collection('analytics').doc('latest').set({
        ...aggregatedData,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      })

    } catch (error) {
      console.error('Error aggregating analytics:', error)
    }
  }) 