/**
 * /api/solutions
 * Generates AI-powered solutions for air quality improvement using Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAQISolution } from '@/lib/geminiService';

export const runtime = 'nodejs';

const validCategories = ['GOOD', 'SATISFACTORY', 'MODERATELY_POLLUTED', 'POOR', 'VERY_POOR', 'SEVERE'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'MODERATELY_POLLUTED').toUpperCase();

  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { 
        error: `Invalid category. Valid options: ${validCategories.join(', ')}` 
      },
      { status: 400 }
    );
  }

  try {
    const solutions = await generateAQISolution(category);
    return NextResponse.json({
      category,
      solutions,
      count: solutions.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Solutions generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate solutions', details: String(error) },
      { status: 500 }
    );
  }
}
