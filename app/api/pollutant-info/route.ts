/**
 * /api/pollutant-info
 * Generates AI-powered educational content about pollutants using Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePollutantEducation } from '@/lib/geminiService';

export const runtime = 'nodejs';

const validPollutants = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NH3'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pollutant = (searchParams.get('pollutant') || 'PM2.5').toUpperCase();

  if (!validPollutants.includes(pollutant)) {
    return NextResponse.json(
      { 
        error: `Invalid pollutant. Valid options: ${validPollutants.join(', ')}` 
      },
      { status: 400 }
    );
  }

  try {
    const info = await generatePollutantEducation(pollutant);
    return NextResponse.json({
      pollutant,
      info,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Pollutant info generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate info', details: String(error) },
      { status: 500 }
    );
  }
}
