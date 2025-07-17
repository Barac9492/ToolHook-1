import { NextResponse, NextRequest } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Challenge } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit') || '1');
    
    const q = query(
      collection(db, 'challenges'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const challenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    
    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch active challenges', challenges: [] }, { status: 500 });
  }
}