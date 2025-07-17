import { NextResponse, NextRequest } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Stack } from '@/types';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    
    const docRef = doc(db, 'stacks', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 });
    }
    
    const stack = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
    };
    
    return NextResponse.json({ stack });
  } catch (error) {
    console.error('Error fetching stack:', error);
    return NextResponse.json({ error: 'Failed to fetch stack' }, { status: 500 });
  }
}