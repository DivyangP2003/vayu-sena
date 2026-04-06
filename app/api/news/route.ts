import { NextRequest, NextResponse } from 'next/server';
import { MOCK_NEWS } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  // Return curated mock news (replace with real news API later)
  return NextResponse.json({
    articles: MOCK_NEWS,
    total: MOCK_NEWS.length,
    source: 'curated',
  });
}
