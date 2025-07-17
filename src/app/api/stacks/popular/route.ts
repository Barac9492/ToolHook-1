import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Stack } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit') || '3');
    
    const q = query(
      collection(db, 'stacks'),
      orderBy('saveCount', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const stacks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
    
    return NextResponse.json({ stacks });
  } catch (error) {
    console.error('Error fetching popular stacks:', error);
    return NextResponse.json({ error: 'Failed to fetch popular stacks', stacks: [] }, { status: 500 });
  }
}