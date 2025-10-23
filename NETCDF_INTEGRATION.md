# NetCDF Integration Summary

## Overview

The backend has been successfully updated to read Sea Level Anomaly (SLA) data directly from local NetCDF files instead of using Google Earth Engine (GEE) assets.

## Changes Made

### 1. Backend (`backend/app.py`)

**Removed:**
- Google Earth Engine initialization and authentication
- GEE-based data access functions

**Added:**
- NetCDF file reading using `xarray`
- Direct file system access to SLA data in `data_pipeline/jiayou_sat_data/monthly_raw/`
- Proper handling of:
  - Longitude coordinate conversion (from -180/180 to 0/360 format)
  - Units conversion (from meters to millimeters)
  - Time dimension handling in NetCDF files
  - NaN value filtering for land/invalid points

**Key Functions:**
- `get_netcdf_filepath(year, month)`: Constructs file path for specific year/month
- `extract_sla_at_point(filepath, lat, lon)`: Extracts SLA value at a point (returns mm)
- `get_timeseries_for_point(lat, lon, month)`: Gets time series for 1993-2022

**API Endpoints Updated:**
- `/health`: Returns status and NetCDF file count
- `/api/timeseries`: Returns SLA time series from NetCDF files
- `/api/point-analytics`: Returns comprehensive analytics from NetCDF files
- `/api/sea-level`: Returns SLA for specific year/month
- `/api/elevation`: Returns placeholder (DEM not available)

### 2. Startup Script (`start_dev.sh`)

**Changes:**
- Backend now runs on port 5001 (port 5000 often occupied by macOS)
- Environment variables updated to use port 5001
- Script creates `.env.local` with correct backend URL

## Data Structure

### NetCDF Files
- **Location:** `data_pipeline/jiayou_sat_data/monthly_raw/`
- **Naming:** `dt_global_twosat_phy_l4_YYYYMM_vDT2021-M01.nc`
- **Coverage:** January 1993 - December 2022 (368 files total)
- **Variables:**
  - `sla`: Sea Level Anomaly in meters
  - Dimensions: (time: 1, latitude: 720, longitude: 1440)
- **Coordinates:**
  - Latitude: -89.875 to 89.875
  - Longitude: 0.125 to 359.875 (0-360° format)

### Data Characteristics
- **Units:** Meters (converted to millimeters in API)
- **Resolution:** ~25km
- **Coverage:** Global ocean (NaN over land)
- **Baseline:** Mean sea level over reference period

## Testing

### Test Backend API

1. **Start backend:**
   ```bash
   cd backend
   source venv/bin/activate  # or ../../ams585venv/bin/activate
   PORT=5001 python app.py
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:5001/health
   ```
   Expected: JSON with `data_files_available: 368`

3. **Test time series endpoint:**
   ```bash
   curl "http://localhost:5001/api/timeseries?lat=40.5&lon=-72.0&month=8"
   ```
   Expected: JSON array with 30 data points (1993-2022)

4. **Test point analytics:**
   ```bash
   curl "http://localhost:5001/api/point-analytics?lat=40.5&lon=-72.0&month=8"
   ```
   Expected: Complete analytics with time series, stats, etc.

### Test Full Application

1. **Clean up old .env.local (if exists):**
   ```bash
   rm frontend/.env.local  # Let the script create a fresh one
   ```

2. **Start both servers:**
   ```bash
   ./start_dev.sh
   ```

3. **Open application:**
   - Navigate to http://localhost:3000
   - Click on an ocean point (avoid land!)
   - View the Analytics panel for SLA time series chart

### Sample Test Coordinates

**Good ocean points (will have data):**
- `lat: 40.5, lon: -72.0` (Atlantic Ocean, off Long Island)
- `lat: 30.0, lon: -80.0` (Atlantic Ocean, off Florida)
- `lat: 35.0, lon: -120.0` (Pacific Ocean, off California)

**Land points (will return NaN/no data):**
- `lat: 40.9446, lon: -73.0220` (Long Island - on land)
- Any coordinate over landmass

## Expected Output

When clicking on an ocean point, you should see:

1. **Location Analytics Panel:**
   - Address/coordinates
   - Key Metrics:
     - Elevation: (not available in NetCDF-only version)
     - Sea Level: Current SLA value in mm
     - Mean SLA, Min, Max, Trend

2. **Time Series Chart:**
   - Title: "Sea Level Anomaly Time Series"
   - X-axis: Years (1993-2022)
   - Y-axis: SLA in mm
   - Blue line showing SLA variation over time
   - Should match the reference image provided

## Troubleshooting

### "Error Loading Data"

**Possible causes:**
1. Clicked on a land point (SLA data only available over ocean)
   - **Solution:** Click on an ocean location
   
2. Backend not running or wrong port
   - **Solution:** Check backend is running on port 5001
   - Check `frontend/.env.local` has `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5001`
   
3. NetCDF files not found
   - **Solution:** Verify files exist in `data_pipeline/jiayou_sat_data/monthly_raw/`
   - Check backend logs for file path errors

### Backend Errors

Check backend logs:
```bash
tail -f backend.log
```

Common issues:
- Missing dependencies: `pip install -r requirements.txt`
- Port already in use: Use different port with `PORT=5002 python app.py`

### Frontend Not Connecting

1. Check frontend is using correct backend URL:
   ```bash
   cat frontend/.env.local
   ```
   Should show: `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5001`

2. Restart frontend after .env.local changes:
   ```bash
   cd frontend
   npm run dev
   ```

## Performance Notes

- First request may be slow (file loading)
- Subsequent requests for same location/month are faster
- Time series requests process 30 files (one per year)
- Expected response time: 1-5 seconds for time series

## Future Enhancements

1. **Add caching:** Cache loaded NetCDF datasets in memory
2. **Add DEM support:** Integrate CoastalDEM from local files
3. **Optimize I/O:** Use Dask for parallel NetCDF reading
4. **Add more variables:** Include other variables from NetCDF (e.g., eke, adt)
5. **Error handling:** Better error messages for edge cases

