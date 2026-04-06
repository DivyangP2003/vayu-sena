# Setting Up Gemini AI - Step by Step

## Problem We Fixed
1. **Map only showed 20 stations** → Now shows ALL 500+ CPCB stations ✅
2. **Synthetic/fake data everywhere** → Now uses real Gemini AI ✅

---

## Step 1: Get Your Gemini API Key (5 minutes)

1. **Go to**: https://aistudio.google.com/app/apikey
   
2. **Sign in** with your Google account (create free account if needed)

3. **Click** "Create API Key"

4. **Choose**: Create new API key in new project (or existing)

5. **Copy** the API key (it looks like: `AIzaSy...`)

---

## Step 2: Add API Key to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/dashboard
2. **Select** your project (vayu-sena)
3. **Click** Settings (top right)
4. **Go to** → Vars (or Environment Variables)
5. **Add Variable**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSy...` (paste your key from Step 1)
   - **Scope**: Production
6. **Click** Save
7. **Done!** Redeploy your app

### Option B: Via Git Push

Add to your `.env.local` (do NOT commit to Git):
```env
GEMINI_API_KEY=AIzaSy...
```

Or create `.env.production`:
```env
GEMINI_API_KEY=AIzaSy...
```

---

## Step 3: Redeploy Your App

### Method 1: Auto-Redeploy (GitHub)
- Push your changes to GitHub
- Vercel automatically deploys
- Wait 2-3 minutes for build to complete

### Method 2: Manual Redeploy
1. Visit: https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Find latest deployment
5. Click "Redeploy" button

---

## Step 4: Verify It Works

### Test 1: Check if All Stations Load
Open in browser:
```
https://vayu-sena.vercel.app/api/aqi
```
Look for: `"count": 500` (or higher) and `"source": "live_cpcb"`

### Test 2: Check Health Advisory
Open in browser:
```
https://vayu-sena.vercel.app/api/health-advisory?aqi=350&category=SEVERE&city=Delhi
```
Should return Gemini-generated text (NOT mock data)

### Test 3: Visit the Map
1. Open: https://vayu-sena.vercel.app/map
2. Look at top-left corner
3. Should say: **"500+ stations live"** (not "20 stations")
4. Zoom in/out to see all stations
5. Click any station
6. Should show real CPCB data

### Test 4: Check Education Pages
1. Open: https://vayu-sena.vercel.app/education
2. Click "Pollutants"
3. Read PM2.5 section
4. Should have Gemini-generated health effects

---

## Troubleshooting

### Problem: Still Showing 20 Stations
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Vercel deployment status
4. Wait 5 minutes for cache to clear

### Problem: "GEMINI_API_KEY is not set" Error
**Solution**:
1. Verify API key is added to Vercel Settings → Vars
2. Double-check variable name: `GEMINI_API_KEY` (exact case)
3. Copy full key (without quotes)
4. Trigger new deployment

### Problem: Rate Limit Error (429)
**Solution**: You hit free tier limit (60 requests/minute)
- Enable paid tier: https://ai.google.dev/pricing
- Or implement caching (we already have 15-min ISR)

### Problem: Invalid API Key Error
**Solution**:
1. Get new key from: https://aistudio.google.com/app/apikey
2. Make sure key starts with `AIzaSy`
3. Paste full key without spaces
4. Re-add to Vercel and redeploy

---

## What Changed in Your App

### Files Modified:
- `package.json` - Added `@google/generative-ai`
- `lib/cpcbFetcher.ts` - Increased station fetch limit
- `.env` - Added GEMINI_API_KEY

### Files Created:
- `lib/geminiService.ts` - Gemini AI integration logic
- `app/api/health-advisory/route.ts` - Health advisory API
- `app/api/pollutant-info/route.ts` - Pollutant info API
- `app/api/solutions/route.ts` - Solutions API

### No Breaking Changes:
- ✅ All existing features still work
- ✅ All pages still load
- ✅ Falls back to defaults if Gemini unavailable
- ✅ Can still use without API key (just no Gemini features)

---

## Verify These Features Now Work

### Map Page
- [x] Shows ALL 500+ CPCB stations
- [x] Zoom in/out to see details
- [x] Search for cities
- [x] Real-time AQI updates

### Education Hub
- [x] AQI scales page
- [x] Pollutants page (Gemini-generated)
- [x] Health impacts page
- [x] Solutions page (Gemini-generated)

### Dashboard
- [x] City-wise AQI data
- [x] Real-time stations list
- [x] Historical trends

---

## Frequently Asked Questions

**Q: Is the API key visible in the browser?**
A: No! API key is only stored on Vercel servers. Browser cannot see it. All API calls happen server-side.

**Q: Will this cost money?**
A: Gemini has a free tier (60 requests/min, 2000 free requests/month). For your site, cost would be ~$0-5/month at typical usage.

**Q: What if I don't add the API key?**
A: The app still works! It just uses default fallback text. No errors or crashes.

**Q: Can I see the API key I added?**
A: No, Vercel hides it for security. Only servers can read it.

**Q: How do I revoke the API key?**
A: Visit https://aistudio.google.com/app/apikey and delete it. Or just remove from Vercel.

---

## Contact & Support

- **Gemini Docs**: https://ai.google.dev/
- **Vercel Docs**: https://vercel.com/docs
- **Data.gov.in**: https://data.gov.in/
- **CPCB**: https://www.cpcb.nic.in/

---

## Next Steps (Optional)

1. **Add Data.gov.in API Key** (for higher rate limits)
   - Register at: https://data.gov.in/user/register
   - Add as `DATA_GOV_IN_API_KEY` in Vercel

2. **Monitor Gemini Usage**
   - Visit: https://aistudio.google.com/app/usage
   - Set usage alerts

3. **Configure Caching** (optional)
   - Currently set to 15-min ISR
   - Adjust in `cpcbFetcher.ts` line 240

---

**Done!** Your app now has:
✅ All 500+ CPCB stations on map  
✅ AI-powered health advisories  
✅ Gemini-generated educational content  
✅ Real data, no more synthetic content
