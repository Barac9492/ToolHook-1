import { NextResponse, NextRequest } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tool } from '@/types';

type Params = { params: { id: string } };

export async function GET(
  request: NextRequest,
  { params }: Params
): Promise<Response> {
  try {
    const id = params.id;
    
    const docRef = doc(db, 'tools', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    
    const tool = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
    };
    
    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 });
  }
}