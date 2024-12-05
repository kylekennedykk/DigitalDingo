export interface TeamMember {
  id: string
  name: string
  role: string
  photo?: string
  description: string
  order: number
}

export interface TeamMemberFormProps {
  member: TeamMember | null
  onSave: (member: Partial<TeamMember>) => Promise<void>
  onCancel: () => void
} 