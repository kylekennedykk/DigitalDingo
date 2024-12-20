'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Pencil, Trash2, Upload } from 'lucide-react'
import { db, storage } from '@/lib/firebase'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { cn } from '@/lib/utils'

interface AboutContent {
  mainText: string
  mission: string
  vision: string
}

type AboutDocData = {
  [K in keyof AboutContent]: string
}

interface TeamMember {
  id?: string
  name: string
  role: string
  bio: string
  imageUrl?: string
}

const defaultMember: TeamMember = {
  name: '',
  role: '',
  bio: ''
}

export default function AboutContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<AboutContent>({
    mainText: '',
    mission: '',
    vision: ''
  })
  const [members, setMembers] = useState<TeamMember[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchContent()
    fetchMembers()
  }, [])

  const fetchContent = async () => {
    try {
      const docRef = doc(db, 'content', 'about')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as AboutContent
        setContent({
          mainText: data.mainText || '',
          mission: data.mission || '',
          vision: data.vision || ''
        })
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'team'))
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[]
      setMembers(membersData)
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const docRef = doc(db, 'content', 'about')
      const docData: AboutDocData = {
        mainText: content.mainText,
        mission: content.mission,
        vision: content.vision
      }
      await updateDoc(docRef, docData)
    } catch (error) {
      console.error('Error updating about content:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return
    setSaving(true)

    try {
      let imageUrl = editingMember.imageUrl

      if (imageFile) {
        // Upload new image
        const storageRef = ref(storage, `team/${Date.now()}-${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)

        // Delete old image if exists and updating
        if (editingMember.id && editingMember.imageUrl) {
          try {
            const oldImageRef = ref(storage, editingMember.imageUrl)
            await deleteObject(oldImageRef)
          } catch (error) {
            console.error('Error deleting old image:', error)
          }
        }
      }

      const memberData = {
        name: editingMember.name,
        role: editingMember.role,
        bio: editingMember.bio.trim(),
        imageUrl: imageUrl || null,
        updatedAt: new Date().toISOString()
      }

      if (editingMember.id) {
        // Update existing member
        const docRef = doc(db, 'team', editingMember.id)
        await updateDoc(docRef, memberData)
        console.log('Updated member:', editingMember.id)
      } else {
        // Add new member
        const docRef = await addDoc(collection(db, 'team'), {
          ...memberData,
          createdAt: new Date().toISOString()
        })
        console.log('Added new member:', docRef.id)
      }
      
      await fetchMembers() // Refresh the list
      setShowMemberForm(false)
      setEditingMember(null)
      setImageFile(null)
      setImagePreview('')
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Failed to save team member. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMember = async (id: string, imageUrl?: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      // Delete image from storage if exists
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl)
        await deleteObject(imageRef)
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'team', id))
      await fetchMembers()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-12">
      {/* About Content Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">About Page Content</h2>
        <form onSubmit={handleContentSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Main Content
            </label>
            <textarea
              value={content.mainText}
              onChange={(e) => setContent({ ...content, mainText: e.target.value })}
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Our Mission
            </label>
            <textarea
              value={content.mission}
              onChange={(e) => setContent({ ...content, mission: e.target.value })}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Our Vision
            </label>
            <textarea
              value={content.vision}
              onChange={(e) => setContent({ ...content, vision: e.target.value })}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Team Members Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <button
            onClick={() => {
              setEditingMember({ ...defaultMember })
              setShowMemberForm(true)
              setImagePreview('')
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </button>
        </div>

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-lg shadow-sm border flex items-start gap-6"
            >
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingMember(member)
                        setShowMemberForm(true)
                        setImagePreview(member.imageUrl || '')
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => member.id && handleDeleteMember(member.id, member.imageUrl)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{member.bio}</p>
                {member.imageUrl && (
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="mt-4 w-24 h-24 object-cover rounded-full" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Member Form Modal */}
      {showMemberForm && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingMember.id ? 'Edit' : 'Add'} Team Member
            </h2>
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ 
                    ...editingMember, 
                    bio: e.target.value
                  })}
                  rows={10}
                  className="mt-1 block w-full px-3 py-2 border rounded-md resize-y min-h-[200px] font-mono"
                  placeholder="Enter bio text. Press Enter twice for new paragraphs:

First paragraph goes here.

Second paragraph goes here.

Third paragraph goes here."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Press Enter twice between paragraphs. Leave a blank line between each paragraph.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="cursor-pointer bg-white px-4 py-2 border rounded-md hover:bg-gray-50">
                    <Upload className="w-5 h-5 inline-block mr-2" />
                    Choose Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {(imagePreview || editingMember.imageUrl) && (
                    <img 
                      src={imagePreview || editingMember.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberForm(false)
                    setEditingMember(null)
                    setImageFile(null)
                    setImagePreview('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 