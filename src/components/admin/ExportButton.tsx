import { Download } from 'lucide-react'
import type { ChatSession } from '@/lib/services/chatService'

interface ExportButtonProps {
  session: ChatSession
}

export function ExportButton({ session }: ExportButtonProps) {
  const handleExport = () => {
    const chatData = {
      id: session.id,
      createdAt: session.createdAt,
      messages: session.messages,
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${session.id.slice(-6)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
      title="Export chat"
    >
      <Download className="w-5 h-5 text-neutral-500" />
    </button>
  )
} 