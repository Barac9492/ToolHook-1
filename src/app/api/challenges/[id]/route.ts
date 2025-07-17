import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const id = params.id

  try {
    const docRef = doc(db, 'challenges', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const challenge = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date()
    }

    return NextResponse.json({ challenge })
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 })
  }
}