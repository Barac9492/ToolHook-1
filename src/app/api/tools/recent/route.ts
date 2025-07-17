import { NextResponse, NextRequest } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tool } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '3');
    const limitCount = parseInt(searchParams.get('limit') || '5');
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const q = query(
      collection(db, 'tools'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const tools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
    
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching recent tools:', error);
    return NextResponse.json({ error: 'Failed to fetch recent tools', tools: [] }, { status: 500 });
  }
}