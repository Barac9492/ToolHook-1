import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tool } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limitCount = parseInt(searchParams.get('limit') || '20');
    
    let q;
    
    if (category && category !== 'all') {
      q = query(
        collection(db, 'tools'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, 'tools'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const snapshot = await getDocs(q);
    const tools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
    
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools by category:', error);
    return NextResponse.json({ error: 'Failed to fetch tools by category', tools: [] }, { status: 500 });
  }
}