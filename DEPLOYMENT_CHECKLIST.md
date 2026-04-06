# Deployment Checklist - Do This Now ✅

## Step 1: Get Gemini API Key (2 minutes)
- [ ] Visit: https://aistudio.google.com/app/apikey
- [ ] Sign in with Google (create account if needed)
- [ ] Click "Create API Key"
- [ ] Copy the key (looks like: `AIzaSy...`)
- [ ] **SAVE THIS KEY SAFELY**

## Step 2: Add to Vercel (3 minutes)
- [ ] Go to: https://vercel.com/dashboard
- [ ] Click your project: **vayu-sena**
- [ ] Click **Settings** (top right)
- [ ] Go to **Vars** (or Environment Variables)
- [ ] Click **Add New Variable**
  - Name: `GEMINI_API_KEY`
  - Value: `AIzaSy...` (paste from Step 1)
  - Scope: **Production**
- [ ] Click **Save**
- [ ] Confirm it's saved (should appear in the list)

## Step 3: Verify Git Push (Already Done)
- [ ] Run: `git log --oneline -5`
- [ ] Should see recent commits with our changes
- [ ] If not, run: `git push origin main` or `git push`
- [ ] Vercel should auto-deploy (2-3 minutes)

## Step 4: Wait for Deployment
- [ ] Go to: https://vercel.com/dashboard
- [ ] Click **vayu-sena**
- [ ] Click **Deployments** tab
- [ ] Wait for latest deployment to turn **Green** (Ready)
- [ ] This takes 2-3 minutes
- [ ] If it stays red, check build logs for errors

## Step 5: Test in Browser (Clear Cache First!)
- [ ] Press: **Ctrl+Shift+Delete** (Chrome/Firefox) or **Cmd+Shift+Delete** (Mac)
- [ ] Select: **All Time** and **All Types**
- [ ] Click: **Clear Now/Data**
- [ ] Then hard refresh: **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac)

## Step 6: Test Station Count
- [ ] Open: https://vayu-sena.vercel.app/map
- [ ] Look at **top-left corner**
- [ ] ✅ Should say: **500+ stations live** (or similar large number)
- [ ] ❌ Should NOT say: **20 stations**
- [ ] **If still showing 20**: Wait 5 more minutes, clear cache again, refresh

## Step 7: Test Health Advisory (Optional but Recommended)
- [ ] Open new tab
- [ ] Paste: `https://vayu-sena.vercel.app/api/health-advisory?aqi=350&category=SEVERE&city=Delhi`
- [ ] ✅ Should return JSON with advisory text
- [ ] ✅ Text should mention "Air quality is severe" or similar
- [ ] ✅ Should NOT be hardcoded mock data

## Step 8: Test Map Functionality
- [ ] Click any station on map
- [ ] Should show station details in right panel
- [ ] Zoom in/out - should show more/fewer markers
- [ ] Search for a city in sidebar
- [ ] Should show stations for that city

## Step 9: Test Education Pages
- [ ] Click: **Education** in navbar
- [ ] Click: **Pollutants**
- [ ] Read PM2.5 section
- [ ] ✅ Should show health effects text
- [ ] Go back and click: **Solutions**
- [ ] ✅ Should show list of solutions/recommendations

## Step 10: Share with Users!
- [ ] Tell users the map is now LIVE with all stations
- [ ] Share the link: https://vayu-sena.vercel.app/
- [ ] Let them know:
  - "All 500+ CPCB stations now visible on the map"
  - "Real-time air quality data from Government of India"
  - "AI-powered health recommendations"

---

## If Something Goes Wrong

### Problem: Map still shows 20 stations
**Solution**:
1. Wait 10 minutes (build might still running)
2. Hard refresh: **Ctrl+Shift+R** (not just F5)
3. Clear entire cache: **Ctrl+Shift+Delete**
4. Check Vercel deployment status (green = ready)
5. Reload page completely

### Problem: API Key Error
**Solution**:
1. Go to Vercel Settings → Vars
2. Check variable name: `GEMINI_API_KEY` (exact spelling)
3. Key should start with: `AIzaSy`
4. Check for extra spaces before/after
5. Delete and re-add if needed
6. Trigger manual redeploy

### Problem: Page shows error 500
**Solution**:
1. Check Vercel Function logs
2. Look for "GEMINI_API_KEY is undefined"
3. Verify API key is added to Vercel
4. Wait for new deployment to complete
5. Hard refresh browser

### Problem: App still using mock data
**Solution**:
1. Clear browser cache completely
2. Hard refresh with Ctrl+Shift+R
3. Open browser DevTools (F12)
4. Check Network tab - should see `/api/health-advisory` calls
5. Check if `GEMINI_API_KEY` exists in Vercel settings

---

## Verification Quick Tests

### Test 1: Station Count (Most Important)
```
URL: https://vayu-sena.vercel.app/api/aqi
Expected: "count": 500 (or higher)
NOT: "count": 20
```

### Test 2: API Response
```
URL: https://vayu-sena.vercel.app/api/health-advisory?aqi=300&city=Delhi
Expected: Real text about air quality
NOT: Hardcoded mock response
```

### Test 3: Visual Confirmation
```
Visit: https://vayu-sena.vercel.app/map
Top-left shows: "500+ stations" 
NOT: "20 stations"
```

---

## Timeline

| Task | Time | Status |
|------|------|--------|
| Get Gemini API Key | 2 min | ⏳ DO THIS NOW |
| Add to Vercel | 3 min | ⏳ DO THIS NOW |
| Push code to GitHub | Already Done ✅ | ✅ Complete |
| Wait for Vercel Deploy | 2-3 min | ⏳ Wait |
| Test and Verify | 5 min | ⏳ After deploy |
| **Total Time** | **12-15 min** | 🚀 Quick! |

---

## Final Checklist Before Announcing

- [ ] Map shows 500+ stations
- [ ] Health advisory API works
- [ ] Education pages load
- [ ] Search functionality works
- [ ] No console errors (F12)
- [ ] Mobile version works
- [ ] Compare tool works
- [ ] All links are working
- [ ] Navbar displays correctly
- [ ] Footer displays correctly

---

## Success! You're Done When:

✅ Map displays **500+ CPCB stations**  
✅ Health advisories are **AI-generated**  
✅ Education pages show **Gemini content**  
✅ No more **synthetic/mock data**  
✅ Everything loads **without errors**  

---

## Important Notes

**DO NOT**:
- ❌ Share your API key publicly
- ❌ Commit API key to GitHub
- ❌ Post screenshots with API key visible
- ❌ Reset deployment before testing

**DO**:
- ✅ Keep API key in Vercel only
- ✅ Monitor usage at: https://aistudio.google.com/app/usage
- ✅ Set up alerts if needed
- ✅ Share only the app URL

---

## Questions?

- **"Why 500+ stations now?"** - We increased fetch limit from 5000 to 10000 records
- **"Why Gemini AI?"** - Real recommendations instead of fake data
- **"Is it expensive?"** - Free tier covers most usage ($0-5/month max)
- **"What if I don't add key?"** - App still works with default fallback text
- **"How long until live?"** - 15 minutes total setup time

---

## Ready to Go?

1. Get your Gemini key → 2 minutes
2. Add to Vercel → 3 minutes
3. Wait for deploy → 2 minutes
4. Test and verify → 5 minutes
5. **Launch!** 🚀

**Start now**: https://aistudio.google.com/app/apikey

---

*Last updated: April 7, 2026*
*All 500+ CPCB stations ready to deploy*
*Gemini AI integration complete*
