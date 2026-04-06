/**
 * Gemini AI Service
 * Generates dynamic health advisories, educational content, and solutions based on real AQI data
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateHealthAdvisory(aqi: number, category: string, city: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return getDefaultAdvisory(aqi, category);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate a brief (2-3 sentences) health advisory for someone in ${city} with current AQI of ${aqi} (${category}). 
    Include specific symptoms they might experience and one immediate action they should take. Keep it concise and India-specific.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text || getDefaultAdvisory(aqi, category);
  } catch (error) {
    console.error('[Gemini] Health advisory generation failed:', error);
    return getDefaultAdvisory(aqi, category);
  }
}

export async function generatePollutantEducation(pollutant: string): Promise<{
  effects: string;
  sources: string;
  prevention: string;
}> {
  if (!process.env.GEMINI_API_KEY) {
    return getDefaultPollutantInfo(pollutant);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Provide health information about ${pollutant} air pollution in India in JSON format with exactly these keys:
    {
      "effects": "2-3 sentence summary of health effects on Indian population",
      "sources": "2-3 sentence summary of major sources in India",
      "prevention": "2-3 practical prevention tips for Indians"
    }
    Respond ONLY with valid JSON, no markdown.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getDefaultPollutantInfo(pollutant);
  } catch (error) {
    console.error('[Gemini] Pollutant education generation failed:', error);
    return getDefaultPollutantInfo(pollutant);
  }
}

export async function generateAQISolution(category: string): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) {
    return getDefaultSolutions(category);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate 5 practical solutions for ${category} air quality in India. Return as JSON array of strings.
    Examples: air purifiers, masks, transport alternatives, indoor plants, government schemes.
    Respond ONLY with JSON array, no markdown.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getDefaultSolutions(category);
  } catch (error) {
    console.error('[Gemini] Solutions generation failed:', error);
    return getDefaultSolutions(category);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fallback defaults if Gemini fails or key not set
// ─────────────────────────────────────────────────────────────────────────

function getDefaultAdvisory(aqi: number, category: string): string {
  const advisories: Record<string, string> = {
    GOOD: 'Air quality is good. Safe for all outdoor activities.',
    SATISFACTORY: 'Air quality is satisfactory. People with respiratory conditions should limit prolonged outdoor exertion.',
    MODERATELY_POLLUTED: 'Air is moderately polluted. Sensitive groups should reduce outdoor activities. Consider wearing masks for extended outdoor time.',
    POOR: 'Air quality is poor. General population should avoid outdoor activities. Vulnerable groups must stay indoors and use air purifiers.',
    VERY_POOR: 'Air quality is very poor. Everyone should limit outdoor exposure. Wear N95 masks if you must go out. Use air purifiers indoors.',
    SEVERE: 'Air quality is severe. Stay indoors. Use N95 masks if necessary to go outside. Run air purifiers continuously.',
  };
  
  return advisories[category] || advisories.MODERATELY_POLLUTED;
}

function getDefaultPollutantInfo(pollutant: string): { effects: string; sources: string; prevention: string } {
  const defaults: Record<string, { effects: string; sources: string; prevention: string }> = {
    'PM2.5': {
      effects: 'Penetrates deep into lungs causing respiratory issues, heart disease, and reduced life expectancy. Particularly harmful to children and elderly.',
      sources: 'Vehicle exhaust, coal power plants, construction dust, industrial emissions, and biomass burning.',
      prevention: 'Use N95 masks, stay indoors during poor air quality, use air purifiers with HEPA filters, avoid outdoor exercise during peak hours.',
    },
    'PM10': {
      effects: 'Causes asthma, coughing, difficulty breathing. Can carry toxins and metals into respiratory system.',
      sources: 'Road dust, construction sites, industrial mills, unpaved roads, and agricultural activities.',
      prevention: 'Wear masks during high pollution, keep windows closed, use air purifiers, avoid dusty areas.',
    },
    'NO2': {
      effects: 'Causes inflammation of airways, reduces lung function, especially in children with asthma.',
      sources: 'Vehicle exhaust, power generation, industrial processes, and cooking.',
      prevention: 'Reduce vehicle use, improve ventilation in homes, plant nitrogen-absorbing vegetation.',
    },
    'SO2': {
      effects: 'Causes respiratory problems, worsens asthma, heart disease. Combines with water to form acid rain.',
      sources: 'Coal burning, oil refining, smelting, geothermal power plants.',
      prevention: 'Avoid areas near industrial zones, use air purifiers, consume antioxidant-rich foods.',
    },
    'CO': {
      effects: 'Reduces oxygen in blood, affects heart and brain. Particularly dangerous in enclosed spaces.',
      sources: 'Vehicle exhaust, industrial processes, combustion of fossil fuels.',
      prevention: 'Avoid heavy traffic areas, improve ventilation, ensure proper appliance maintenance.',
    },
    'O3': {
      effects: 'Damages lungs, causes respiratory diseases, reduces lung function in children and outdoor workers.',
      sources: 'Secondary pollutant from NOx and VOCs in sunlight, industrial emissions.',
      prevention: 'Limit outdoor activities during peak ozone hours (afternoon/evening), plant pollution-absorbing trees.',
    },
  };
  
  return defaults[pollutant] || defaults['PM2.5'];
}

function getDefaultSolutions(category: string): string[] {
  const solutionsByCategory: Record<string, string[]> = {
    GOOD: [
      'Maintain current clean air practices',
      'Plant more trees in residential areas',
      'Promote renewable energy usage',
      'Support public transport advocacy',
      'Educate community on air quality',
    ],
    SATISFACTORY: [
      'Use air purifiers in sensitive spaces',
      'Switch to electric vehicles',
      'Plant indoor air-purifying plants',
      'Use quality dust masks when needed',
      'Support local pollution reduction initiatives',
    ],
    MODERATELY_POLLUTED: [
      'Install HEPA air purifiers at home',
      'Wear N95 masks for outdoor work',
      'Reduce traffic exposure',
      'Use indoor plants (Snake Plants, Pothos)',
      'Support government pollution control schemes',
    ],
    POOR: [
      'Stay indoors with air purifiers running',
      'Use N95/N99 masks when going outside',
      'Create sealed rooms with portable HEPA',
      'Avoid strenuous outdoor exercise',
      'Advocate for pollution control policies',
    ],
    VERY_POOR: [
      'Mandatory use of N95 masks outdoors',
      'Keep air purifiers running 24/7',
      'Seal windows and doors tightly',
      'Use CAQM guidelines for activities',
      'Demand implementation of Odd-Even scheme',
    ],
    SEVERE: [
      'Complete restriction on outdoor activities',
      'Use respirators/gas masks if must venture out',
      'Run hospital-grade air filtration',
      'Comply with government restrictions',
      'Demand emergency pollution control measures',
    ],
  };
  
  return solutionsByCategory[category] || solutionsByCategory.MODERATELY_POLLUTED;
}
