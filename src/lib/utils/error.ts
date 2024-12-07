type ErrorWithMessage = {
  message: string
  code?: string
  [key: string]: any
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (isErrorWithMessage(error)) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

export function createErrorMessage(error: unknown): string {
  const message = getErrorMessage(error)
  console.error('Error:', error)
  return message
} 