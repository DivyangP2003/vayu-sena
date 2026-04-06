import { NextRequest, NextResponse } from 'next/server';
import { generateMockAQI } from '@/lib/mockData';

async function generateWithGemini(city: string, aqi: number, pm25: number, dominantSource: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;

  const prompt = `You are an environmental health expert for India. Generate 3 concise "flash notes" about current air quality in ${city}.

Current data:
- AQI: ${aqi} (${aqi > 300 ? 'Very Poor' : aqi > 200 ? 'Poor' : aqi > 100 ? 'Moderate' : 'Good'})
- PM2.5: ${pm25} µg/m³
- Dominant pollution source: ${dominantSource}
- Location: ${city}, India

Generate exactly 3 flash notes. Each note should be:
1. A HEALTH tip specific to this AQI level
2. A SOURCE explanation about why ${dominantSource} is the main cause today
3. A FORECAST/ACTION item for the next 24 hours

Return ONLY a JSON array with this exact structure, no markdown, no extra text:
[
  {"id": "1", "title": "...", "content": "...", "category": "health"},
  {"id": "2", "title": "...", "content": "...", "category": "source"},
  {"id": "3", "title": "...", "content": "...", "category": "forecast"}
]

Keep each content under 80 words. Be specific to Indian context and ${city}.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function generateFallbackNotes(city: string, aqi: number, dominantSource: string) {
  const isGood = aqi < 100;
  const isBad = aqi > 200;
  const ts = new Date().toISOString();

  return [
    {
      id: '1',
      title: isBad ? `⚠ Health Alert — ${city}` : `Air Quality Update — ${city}`,
      content: isBad
        ? `AQI is ${aqi} — wear N95 masks outdoors, keep windows closed, and use an air purifier indoors. Avoid morning walks and outdoor exercise today. Children and elderly should stay inside.`
        : `AQI is ${aqi} — conditions are ${isGood ? 'good' : 'moderate'} today. ${isGood ? 'Good day for outdoor activities. Keep windows open for fresh air.' : 'Sensitive groups should limit prolonged outdoor exposure.'}`,
      category: 'health',
      generatedAt: ts,
      city,
      aqiContext: aqi,
    },
    {
      id: '2',
      title: `Main Source: ${dominantSource}`,
      content: `Today's dominant pollution source in ${city} is ${dominantSource.toLowerCase()}. ${
        dominantSource.includes('Traffic')
          ? 'Peak vehicular emissions typically occur between 8–10 AM and 6–8 PM. Consider avoiding major roads during these windows.'
          : dominantSource.includes('Burning')
          ? 'Agricultural or waste burning is contributing significantly to PM2.5. Wind from NW India is carrying pollutants into urban areas.'
          : dominantSource.includes('Construction')
          ? 'Active construction sites are releasing fine dust particles. Wet masking of roads and sites can reduce this significantly.'
          : 'Industrial emissions are elevated today. Check factory operation schedules and report visible smoke to authorities.'
      }`,
      category: 'source',
      generatedAt: ts,
      city,
      aqiContext: aqi,
    },
    {
      id: '3',
      title: 'Next 24 Hours Outlook',
      content: isBad
        ? `Conditions in ${city} are likely to remain poor. Watch for wind direction changes — a westerly wind would bring relief. Evening inversion may worsen AQI further after 8 PM. Track updates every 2 hours.`
        : `Conditions in ${city} should ${isGood ? 'remain stable' : 'improve slightly'} over the next day. Pre-dawn hours typically see highest PM2.5 — plan outdoor activity between 10 AM and 3 PM for cleanest air.`,
      category: 'forecast',
      generatedAt: ts,
      city,
      aqiContext: aqi,
    },
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Delhi';

  try {
    const aqiData = generateMockAQI(city);

    // Try Gemini first
    const geminiNotes = await generateWithGemini(
      city,
      aqiData.aqi,
      aqiData.pm25,
      aqiData.dominantSource
    );

    if (geminiNotes) {
      const notes = geminiNotes.map((n: { id: string; title: string; content: string; category: string }, i: number) => ({
        ...n,
        id: String(i + 1),
        generatedAt: new Date().toISOString(),
        city,
        aqiContext: aqiData.aqi,
      }));
      return NextResponse.json({ notes, source: 'gemini', city });
    }

    // Fallback
    const notes = generateFallbackNotes(city, aqiData.aqi, aqiData.dominantSource);
    return NextResponse.json({ notes, source: 'fallback', city });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate flash notes', details: String(error) },
      { status: 500 }
    );
  }
}
