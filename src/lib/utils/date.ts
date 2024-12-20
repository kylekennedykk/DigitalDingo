import { format, parseISO } from 'date-fns'

export function formatDate(date: Date | string | number | { seconds: number } | { _seconds: number }) {
  try {
    // If it's a Firestore Timestamp (has seconds)
    if (date && typeof date === 'object' && ('seconds' in date || '_seconds' in date)) {
      const seconds = 'seconds' in date ? date.seconds : date._seconds
      return format(new Date(seconds * 1000), 'PPpp')
    }
    
    // If it's a string that might be an ISO date
    if (typeof date === 'string') {
      if (date.includes('T')) {
        return format(parseISO(date), 'PPpp')
      }
      // If it's a timestamp string
      return format(new Date(parseInt(date)), 'PPpp')
    }
    
    // If it's a number (unix timestamp)
    if (typeof date === 'number') {
      // Check if it's seconds (Firestore) or milliseconds
      const timestamp = date > 9999999999 ? date : date * 1000
      return format(new Date(timestamp), 'PPpp')
    }

    // If it's a Date object
    if (date instanceof Date) {
      return format(date, 'PPpp')
    }

    throw new Error('Unsupported date format')
  } catch (error) {
    console.error('Date formatting error:', error, 'Value:', date)
    return 'Invalid date'
  }
} 