/**
 * /api/health-advisory
 * Generates AI-powered health advisories based on real AQI data using Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateHealthAdvisory } from '@/lib/geminiService';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const aqi = parseInt(searchParams.get('aqi') || '100');
  const category = searchParams.get('category') || 'SATISFACTORY';
  const city = searchParams.get('city') || 'India';

  if (isNaN(aqi) || aqi < 0 || aqi > 500) {
    return NextResponse.json(
      { error: 'Invalid AQI value. Must be 0-500.' },
      { status: 400 }
    );
  }

  try {
    const advisory = await generateHealthAdvisory(aqi, category, city);
    return NextResponse.json({
      advisory,
      aqi,
      category,
      city,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Health advisory generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate advisory', details: String(error) },
      { status: 500 }
    );
  }
}
