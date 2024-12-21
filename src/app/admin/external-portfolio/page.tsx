'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ExternalPortfolioForm } from './components/ExternalPortfolioForm'
import { Dialog } from '@/components/ui/dialog'

interface ExternalPortfolioItem {
  id: string
  name: string
  description: string
  url: string
  thumbnail?: string
  tags: string[]
  published: boolean
  featured?: boolean
}

export default function ExternalPortfolioPage() {
  const [projects, setProjects] = useState<ExternalPortfolioItem[]>([])
  const [selectedProject, setSelectedProject] = useState<ExternalPortfolioItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, 'portfolio-external')
      const projectsSnapshot = await getDocs(projectsRef)
      const projectsList = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExternalPortfolioItem[]
      setProjects(projectsList)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEdit = (project: ExternalPortfolioItem) => {
    setSelectedProject(project)
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setSelectedProject(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setSelectedProject(null)
    setIsEditing(false)
  }

  const handleSaveComplete = () => {
    fetchProjects()
    setIsEditing(false)
    setSelectedProject(null)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">External Portfolio</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Project
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-lg">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <div className="mt-2 flex gap-2">
                {project.tags?.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded-full text-sm ${
                project.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {project.published ? 'Published' : 'Draft'}
              </span>
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isEditing}
        onClose={handleCancel}
        title={selectedProject ? 'Edit Project' : 'Add New Project'}
      >
        <ExternalPortfolioForm
          key={selectedProject?.id || 'new'}
          project={selectedProject || undefined}
          onCancel={handleCancel}
          onSaveComplete={handleSaveComplete}
        />
      </Dialog>
    </div>
  )
} 