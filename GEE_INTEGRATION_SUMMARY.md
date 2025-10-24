# Google Earth Engine Integration - Implementation Summary

## Overview

The Coastal Flood Viewer app now pulls **real elevation data from Google Earth Engine**, exactly as implemented in `test_shreya/test_shreya_app.py`.

## What Was Implemented

### 1. Backend API Service (`backend/app.py`)

A Python Flask API that connects to Google Earth Engine and provides the following endpoints:

#### Core Data Access (Same as test_shreya_app.py)

```python
def get_dem():
    """Get the DEM ImageCollection - EXACT implementation from test_shreya"""
    return ee.ImageCollection("users/amanaryya1/coastal-dem-files").mosaic().rename("elev").toFloat()
```

This is the **exact same code** used in test_shreya_app.py line 163.

#### API Endpoints

1. **`GET /api/elevation`** - Get elevation at a point
   - Uses the same DEM asset: `users/amanaryya1/coastal-dem-files`
   - Same sampling method as test_shreya_app.py

2. **`GET /api/sea-level`** - Get sea level anomaly at a point
   - Uses: `projects/sea-level-analysis/assets/Jiayou/sla_{year}-{month}-15`
   - Same data source as test_shreya_app.py line 167

3. **`GET /api/timeseries`** - Get historical SLA time series
   - Same time range: 1993-2022
   - Same monthly data structure

4. **`GET /api/point-analytics`** - Get comprehensive analytics
   - Combines elevation, sea level, and time series
   - Returns the same statistics as test_shreya_app.py

### 2. Frontend Integration

#### Updated Files

1. **`frontend/src/lib/dataClient.ts`**
   - Added methods to call the backend API
   - `getPointAnalytics()` - fetches all data in one call
   - `getElevation()` - fetches elevation only
   - `getSeaLevel()` - fetches sea level only
   - `getTimeSeries()` - fetches time series only

2. **`frontend/src/components/map/InteractiveMap.tsx`**
   - Updated map click handler to use real GEE data
   - Calls `dataClient.getPointAnalytics()` instead of generating mock data
   - Uses current year/month from the app state

### 3. Configuration Files

1. **`backend/requirements.txt`** - Python dependencies including `earthengine-api`
2. **`backend/README.md`** - Complete API documentation
3. **`frontend/.env.local.example`** - Frontend environment variables
4. **`SETUP_GEE.md`** - Detailed setup guide
5. **`start_dev.sh`** - Convenience script to start both servers

## Data Flow

```
User clicks on map
    ↓
Frontend (InteractiveMap.tsx)
    ↓
dataClient.getPointAnalytics(lat, lon, year, month)
    ↓
Backend API (http://localhost:5000/api/point-analytics)
    ↓
Google Earth Engine
    ├── DEM: users/amanaryya1/coastal-dem-files
    └── SLA: projects/sea-level-analysis/assets/Jiayou/sla_*
    ↓
Backend processes and returns JSON
    ↓
Frontend displays:
    ├── Elevation value
    ├── Sea level anomaly
    ├── Time series chart (1993-2022)
    └── Statistics (mean, median, min, max, trend)
```

## Comparison with test_shreya_app.py

| Feature | test_shreya_app.py | coastal-flood-viewer |
|---------|-------------------|---------------------|
| DEM Asset | `ee.ImageCollection("users/amanaryya1/coastal-dem-files").mosaic()` | ✅ **Exact same** |
| SLA Asset | `projects/sea-level-analysis/assets/Jiayou/sla_*` | ✅ **Exact same** |
| Elevation Sampling | `reduceRegion()` with `first()` | ✅ **Exact same** |
| Sea Level Sampling | `reduceRegion()` with `median()` + ocean mask | ✅ **Exact same** |
| Time Range | 1993-2022 | ✅ **Exact same** |
| Month Collection | Loop through years for selected month | ✅ **Exact same** |
| EE Initialization | `ee.Initialize(project='sea-level-analysis')` | ✅ **Exact same** |

## Key Implementation Details

### Earth Engine Initialization

The backend uses the same initialization as test_shreya_app.py:

```python
def init_ee():
    """Initialize Earth Engine with default credentials"""
    try:
        ee.Initialize(project='sea-level-analysis')
    except Exception:
        ee.Authenticate()
        ee.Initialize(project='sea-level-analysis')
```

### Elevation Query

Same parameters as test_shreya_app.py:

```python
elev_stats = DEM.reduceRegion(
    reducer=ee.Reducer.first(),
    geometry=point,
    scale=scale,  # Default: 300m
    maxPixels=1e13,
    bestEffort=True,
    tileScale=4
)
```

### Sea Level Query

Same ocean masking and sampling as test_shreya_app.py:

```python
ocean = ee.Image('NOAA/NGDC/ETOPO1').select('bedrock').lt(0)
sea_surface_m = sla_m.updateMask(ocean)
sea_stats = sea_surface_m.reduceRegion(
    reducer=ee.Reducer.median(),
    geometry=point.buffer(25000),  # 25km buffer
    scale=5000,
    maxPixels=1e13,
    bestEffort=True,
    tileScale=4
)
```

## How to Use

### 1. Start the Backend

```bash
cd coastal-flood-viewer/backend
source ~/path/to/ams585venv/bin/activate
python app.py
```

### 2. Start the Frontend

```bash
cd coastal-flood-viewer/frontend
npm run dev
```

### 3. Test the Integration

```bash
cd coastal-flood-viewer/backend
python test_backend.py
```

### 4. Use the App

1. Open http://localhost:3000
2. Navigate to "Flood Mapper" or "Explorer"
3. Click anywhere on the map
4. You'll see:
   - **Real elevation** from your GEE DEM asset (not random mock data)
   - **Real sea level anomaly** from Jiayou dataset
   - **Real time series** from 1993-2022
   - **Real statistics** calculated from actual data

## Verification

To verify you're getting real GEE data and not mock data:

1. **Check the elevation values**: They should be realistic for the location (not random 0-10m)
2. **Check the console**: Backend logs will show GEE queries
3. **Run the test script**: `python backend/test_backend.py`
4. **Compare with test_shreya_app.py**: Click the same location in both apps - values should match

## Environment Variables

### Backend
No environment variables required! Uses default EE authentication.

### Frontend
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Troubleshooting

### "Earth Engine failed to initialize"
Run: `earthengine authenticate`

### "Failed to fetch point analytics"
- Make sure backend is running on port 5000
- Check backend logs for GEE errors
- Verify you have access to the GEE assets

### Getting null values
- The point may be outside the DEM coverage
- Try clicking on US coastal areas
- Check the GEE asset coverage

## Next Steps

### Production Deployment
1. Deploy backend to Google Cloud Run (recommended for GEE)
2. Deploy frontend to GitHub Pages
3. Update CORS settings to only allow your frontend domain
4. Consider using a GEE Service Account for production

### Performance Optimization
1. Add Redis caching for frequently queried locations
2. Implement rate limiting
3. Pre-compute common locations
4. Add request queuing for GEE queries

## Files Created/Modified

### New Files
- `backend/app.py` - Flask API with GEE integration
- `backend/requirements.txt` - Python dependencies
- `backend/README.md` - Backend documentation
- `backend/test_backend.py` - Integration tests
- `SETUP_GEE.md` - Setup guide
- `start_dev.sh` - Development startup script
- `GEE_INTEGRATION_SUMMARY.md` - This file

### Modified Files
- `frontend/src/lib/dataClient.ts` - Added GEE API methods
- `frontend/src/components/map/InteractiveMap.tsx` - Use real GEE data
- `README.md` - Updated with setup instructions

## Summary

✅ The coastal-flood-viewer app now uses the **exact same Google Earth Engine implementation** as test_shreya_app.py

✅ All data is pulled from the **same GEE assets**:
- `users/amanaryya1/coastal-dem-files` for elevation
- `projects/sea-level-analysis/assets/Jiayou` for sea level anomaly

✅ The app produces the **same output** as test_shreya_app.py but in a modern web interface

✅ Ready for development - just run `./start_dev.sh` and start clicking on the map!

