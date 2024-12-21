import { NextRequest } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'

type Props = {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = params
    
    const db = getFirestore()
    const docRef = await db.collection('portfolio-sites').doc(id).get()
    
    if (!docRef.exists) {
      return new Response(JSON.stringify({ error: 'Site not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      id: docRef.id,
      ...docRef.data()
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching portfolio site:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch portfolio site' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const data = await request.json()
    const db = getFirestore()
    
    await db.collection('portfolio-sites').doc(params.id).update({
      ...data,
      updatedAt: new Date().toISOString()
    })

    const updatedDoc = await db.collection('portfolio-sites').doc(params.id).get()
    
    return new Response(JSON.stringify({
      id: updatedDoc.id,
      ...updatedDoc.data()
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating portfolio site:', error)
    return new Response(JSON.stringify({ error: 'Failed to update portfolio site' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const db = getFirestore()
    await db.collection('portfolio-sites').doc(params.id).delete()
    
    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting portfolio site:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete portfolio site' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}