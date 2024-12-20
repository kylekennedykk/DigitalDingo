export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'in-progress' | 'completed'
  createdAt: string
  notes: Note[]
}

export interface Note {
  content: string
  timestamp: string
} 