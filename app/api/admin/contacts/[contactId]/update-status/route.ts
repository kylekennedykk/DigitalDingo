import { NextRequest } from 'next/server'
import { db } from '@/src/lib/firebase/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

type RouteParams = {
  params: {
    contactId: string
  }
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { status } = await request.json()
    
    if (!status) {
      return Response.json({ error: 'Status is required' }, { status: 400 })
    }

    const contactRef = doc(db, 'contacts', context.params.contactId)
    const contactSnap = await getDoc(contactRef)

    if (!contactSnap.exists()) {
      return Response.json({ error: 'Contact not found' }, { status: 404 })
    }

    await updateDoc(contactRef, { status })

    return Response.json({ 
      success: true, 
      status 
    })

  } catch (error) {
    console.error('Error updating status:', error)
    return Response.json(
      { error: 'Failed to update status' }, 
      { status: 500 }
    )
  }
} 