import { NextRequest, NextResponse } from 'next/server';
import { MOCK_REPORTS } from '@/lib/mockData';
import { CitizenReport } from '@/lib/types';

// In-memory store for MVP (replace with DB in production)
let reports: CitizenReport[] = [...MOCK_REPORTS];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filtered = city
    ? reports.filter(r => r.city.toLowerCase() === city.toLowerCase())
    : reports;

  filtered = filtered
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return NextResponse.json({ reports: filtered, total: filtered.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lat, lng, city, description, sourceType, severity,
    } = body;

    if (!lat || !lng || !city || !description || !sourceType || !severity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReport: CitizenReport = {
      id: String(Date.now()),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city,
      description,
      sourceType,
      severity,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      status: 'pending',
      estimatedPM25: body.estimatedPM25 || undefined,
    };

    reports = [newReport, ...reports];

    return NextResponse.json({
      success: true,
      report: newReport,
      message: 'Report submitted successfully. Our team will verify it shortly.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
