# 🌬️ Vayu Sainik — India Air Quality Intelligence

> Real-time ward-level AQI, citizen pollution reporting, and AI source attribution for India. No hardware required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DivyangP2003/vayu-sena)

---

## Features

- **Live AQI Dashboard** — Real-time air quality for 20+ Indian cities
- **Interactive India Map** — Color-coded AQI bubbles on a dark map
- **AI Flash Notes** — Gemini-powered health tips, source analysis, 24hr outlook
- **Citizen Reporting** — Submit geo-tagged pollution reports (no sensor needed)
- **Alerts System** — Real-time alerts for cities crossing AQI 200/300
- **14-day Trends** — Historical AQI chart with PM2.5/PM10 breakdown
- **Source Attribution** — Traffic, burning, construction, industrial attribution per city

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Maps | Leaflet.js |
| Charts | Chart.js |
| AI | Google Gemini 1.5 Flash |
| Data | CPCB, OpenAQ, NASA MODIS, CAMS |
| Deploy | Vercel (Mumbai region) |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/DivyangP2003/vayu-sena.git
cd vayu-sena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to get it | Required |
|----------|----------------|----------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | For AI Flash Notes |
| `OPENAQ_API_KEY` | [OpenAQ](https://explore.openaq.org/developers/keys) | For real AQI data |
| `OPENWEATHER_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) | For weather overlay |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | [Google Cloud Console](https://console.cloud.google.com) | Optional (satellite map) |
| `DATA_GOV_IN_API_KEY` | [data.gov.in](https://data.gov.in/user/register) | For CPCB data |

> **Note:** The app works fully with mock data if no API keys are provided. Mock data is realistic and India-calibrated.

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

Or use the one-click button above.

## Data Sources

- **CPCB CAAQMS** — Central Pollution Control Board real-time stations
- **OpenAQ** — Aggregated global air quality API
- **NASA MODIS MAIAC** — Aerosol optical depth satellite data
- **Copernicus CAMS** — Atmospheric composition forecasts
- **IMD** — India Meteorological Department wind data
- **SAFAR IITM** — System of Air Quality and Weather Forecasting

## Project Structure

```
vayu-sena/
├── app/
│   ├── page.tsx              # Homepage
│   ├── dashboard/page.tsx    # City dashboard
│   ├── map/page.tsx          # Live map
│   ├── report/page.tsx       # Citizen report
│   ├── alerts/page.tsx       # AQI alerts
│   ├── about/page.tsx        # About
│   └── api/
│       ├── aqi/route.ts      # AQI data API
│       ├── flash-notes/route.ts  # Gemini AI notes
│       ├── reports/route.ts  # Citizen reports
│       ├── news/route.ts     # News feed
│       └── alerts/route.ts   # Alerts API
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── ui/                   # AQIBadge, FlashNotes
│   ├── charts/               # Chart.js components
│   └── map/                  # Leaflet map
├── lib/
│   ├── types.ts              # Types & constants
│   ├── mockData.ts           # Fallback data
│   └── utils.ts              # Utilities
└── styles/globals.css        # Global styles
```

## Contributing

PRs welcome! This is an open-source project built for India's air crisis.

## License

MIT — built by Divyang Patel
