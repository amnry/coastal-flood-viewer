# Quick Start Guide - NetCDF Integration

## 🎯 Objective
This guide will help you start the coastal-flood-viewer application with real NetCDF SLA data and see the working time series chart.

## ✅ Prerequisites Verified

- ✅ NetCDF files present: 368 files in `data_pipeline/jiayou_sat_data/monthly_raw/`
- ✅ Backend configured to read from local files
- ✅ Dependencies: xarray, netCDF4, Flask installed in venv
- ✅ Port 5001 configured (5000 is occupied)

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)

```bash
cd "/Users/amanarya/Library/Mobile Documents/com~apple~CloudDocs/AMS585/coastal-flood-viewer"

# Remove old env file if it exists (to get fresh config)
rm -f frontend/.env.local

# Start both frontend and backend
./start_dev.sh
```

The script will:
1. Start backend on port 5001
2. Start frontend on port 3000
3. Show logs from both servers

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd "/Users/amanarya/Library/Mobile Documents/com~apple~CloudDocs/AMS585/coastal-flood-viewer/backend"
source venv/bin/activate
PORT=5001 python app.py
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/amanarya/Library/Mobile Documents/com~apple~CloudDocs/AMS585/coastal-flood-viewer/frontend"

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5001
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF

npm run dev
```

## 🧪 Testing the Application

### 1. Verify Backend is Running

```bash
curl http://localhost:5001/health
```

Expected output:
```json
{
    "status": "healthy",
    "service": "Coastal Flood Viewer API",
    "data_files_available": 368,
    "data_directory": "..."
}
```

### 2. Test the Time Series API

```bash
curl "http://localhost:5001/api/timeseries?lat=40.5&lon=-72.0&month=8" | python3 -m json.tool
```

Expected: 30 data points from 1993-2022 with SLA values in mm.

### 3. Open the Application

1. Open browser: **http://localhost:3000**

2. Navigate to the map view

3. **Click on an OCEAN point** (important - land points will return no data)
   
   **Good test coordinates:**
   - **Atlantic Ocean (off Long Island):** Click around `40.5°N, 72°W`
   - **Atlantic Ocean (off Florida):** Click around `30°N, 80°W`
   - **Pacific Ocean (off California):** Click around `35°N, 120°W`

4. View the **Analytics Panel** on the left side

5. You should see:
   - **Selected Location** with coordinates
   - **Key Metrics:**
     - Sea Level: Current SLA value (in mm)
     - Mean SLA, Min, Max
     - Trend: mm/year
   - **Time Series Chart:**
     - Title: "Sea Level Anomaly Time Series"
     - Blue line showing SLA from 1993-2022
     - Similar to the reference image you provided

## 📊 Expected Results

The time series chart should show:
- **X-axis:** Years from 1993 to 2022
- **Y-axis:** Sea Level Anomaly in millimeters (mm)
- **Data:** Blue line with ~30 data points
- **Trend:** Generally increasing over time (global sea level rise)

Example values for `lat=40.5, lon=-72.0, month=8`:
- 1993-08: ~13.6 mm
- 2000-08: ~33.8 mm
- 2010-08: ~120.6 mm
- 2020-08: ~110.5 mm
- Trend: ~3.28 mm/year

## ❌ Troubleshooting

### "Error Loading Data. Please try again."

**Cause:** Likely clicked on a land point (no ocean SLA data available)

**Solution:** Click on an ocean location away from coastlines

### Backend connection errors

1. **Check backend is running:**
   ```bash
   lsof -i :5001
   ```

2. **Check frontend config:**
   ```bash
   cat frontend/.env.local
   ```
   Should show: `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5001`

3. **Restart frontend** if you changed .env.local:
   ```bash
   # Ctrl+C to stop, then:
   npm run dev
   ```

### No data in chart

1. **Check browser console** (F12) for errors
2. **Check backend logs:**
   ```bash
   tail -f backend.log
   ```
3. **Verify API call:**
   ```bash
   curl "http://localhost:5001/api/point-analytics?lat=40.5&lon=-72.0&month=8"
   ```

## 🎨 Chart Customization

The chart should automatically match the dark theme and styling of the slr-flood-app reference image with:
- Dark background
- Blue line color
- White text
- Grid lines
- Proper axis labels

If you need to adjust the chart styling, check:
`frontend/src/components/panels/AnalyticsPanel.tsx`

## 📝 Notes

- **First load may be slow** - NetCDF files are loaded on demand
- **Ocean points only** - SLA data only exists over ocean
- **Month parameter** - Changes which month's time series to show across all years
- **Data coverage:** 1993-2022 (30 years)

## 🎉 Success Criteria

You'll know it's working when:
1. ✅ Backend health check returns 368 files
2. ✅ Time series API returns 30 data points
3. ✅ Frontend loads without errors
4. ✅ Clicking ocean point shows SLA chart
5. ✅ Chart displays data from 1993-2022
6. ✅ Values are in reasonable range (-50 to +200 mm)
7. ✅ Chart style matches reference image

## 🔗 Useful URLs

- **Frontend:** http://localhost:3000
- **Backend Health:** http://localhost:5001/health
- **Backend Logs:** `tail -f backend.log`
- **Frontend Logs:** `tail -f frontend.log`

## 📚 More Information

See `NETCDF_INTEGRATION.md` for detailed technical information about the implementation.

