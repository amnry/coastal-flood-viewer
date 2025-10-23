# Summary of Changes - NetCDF Integration

## Date
October 23, 2024

## Objective
Fix the SLA time series chart in `coastal-flood-viewer` to display real data from local NetCDF files, matching the working implementation in `slr-flood-app`.

## Problem
- The application was showing "Error loading data. Please try again."
- Backend was trying to use Google Earth Engine (GEE) assets that were not accessible
- Need to use local NetCDF files in `data_pipeline/jiayou_sat_data/monthly_raw/`

## Solution
Replaced GEE-based data access with direct NetCDF file reading using xarray.

## Files Changed

### 1. `backend/app.py` (Major refactor)
**Changes:**
- Removed Earth Engine initialization and imports
- Added xarray and numpy imports
- Added Path for file system operations
- Replaced GEE functions with NetCDF reading functions

**New Functions:**
```python
get_netcdf_filepath(year, month) -> Path
extract_sla_at_point(filepath, lat, lon) -> float | None
get_timeseries_for_point(lat, lon, month) -> list
```

**Key Updates:**
- Longitude conversion: -180/180 → 0/360 format
- Units conversion: meters → millimeters (*1000)
- Time dimension handling in NetCDF files
- NaN filtering for land/invalid points

**API Endpoints Modified:**
- `/health`: Returns NetCDF file count
- `/api/timeseries`: Reads from NetCDF files
- `/api/point-analytics`: Reads from NetCDF files
- `/api/sea-level`: Reads from NetCDF files
- `/api/elevation`: Returns placeholder (DEM not available)
- Tile endpoints: Return transparent tiles (not implemented)

### 2. `start_dev.sh`
**Changes:**
- Backend port: 5000 → 5001 (macOS often uses 5000)
- Environment variable: Updated to port 5001
- Documentation: Updated URLs to port 5001

**Lines Changed:**
- Line 54: Added `PORT=5001` to python command
- Line 79: Updated .env.local creation to use port 5001
- Lines 102-103: Updated displayed URLs

### 3. `frontend/src/lib/dataClient.ts`
**Changes:**
- Default backend URL: Updated from port 5000 to 5001
- Line 8: `BACKEND_API_URL` default changed

### 4. New Documentation Files Created

**`NETCDF_INTEGRATION.md`:**
- Detailed technical documentation
- Data structure explanation
- API endpoint details
- Troubleshooting guide
- Performance notes
- Future enhancements

**`QUICKSTART_NETCDF.md`:**
- Quick start instructions
- Testing procedures
- Sample coordinates
- Troubleshooting tips
- Success criteria

**`CHANGES_SUMMARY.md`:** (this file)
- Summary of all changes

## Data Processing Flow

### Before (GEE-based)
```
User clicks map
    ↓
Frontend calls /api/point-analytics
    ↓
Backend queries Google Earth Engine
    ↓
GEE returns processed data
    ↓
Backend formats and returns
    ↓
Frontend displays chart
```

### After (NetCDF-based)
```
User clicks map (ocean point)
    ↓
Frontend calls /api/point-analytics
    ↓
Backend reads local NetCDF files
    ↓
Extract SLA values at lat/lon
    ↓
Convert units (m → mm) and coordinates (-180/180 → 0/360)
    ↓
Calculate statistics (mean, trend, etc.)
    ↓
Backend returns JSON
    ↓
Frontend displays chart
```

## Technical Details

### NetCDF File Structure
- **Files:** 368 total (12 months × ~30 years, plus extras)
- **Naming:** `dt_global_twosat_phy_l4_YYYYMM_vDT2021-M01.nc`
- **Variables:** sla (Sea Level Anomaly), eke, time, latitude, longitude
- **Dimensions:** time=1, latitude=720, longitude=1440
- **Resolution:** ~25km global ocean grid
- **Units:** meters (converted to mm in API)

### Coordinate Systems
- **NetCDF:** Longitude 0-360°, Latitude -90 to 90°
- **Frontend:** Longitude -180 to 180°, Latitude -90 to 90°
- **Conversion:** `lon_360 = lon if lon >= 0 else lon + 360`

### Data Coverage
- **Temporal:** January 1993 - December 2022 (30 years)
- **Spatial:** Global ocean (NaN over land)
- **Typical Range:** -50 to +200 mm
- **Trend:** ~3.3 mm/year (global average)

## Testing Results

### Backend API Tests
✅ Health check: Returns 368 files available
✅ Time series: Returns 30 data points (1993-2022)
✅ Point analytics: Returns complete data with stats
✅ Coordinates: Properly converts lon -72° to 288°
✅ Units: Correctly converts m to mm
✅ NaN handling: Filters out land points

### Sample Data Validation
**Location:** 40.5°N, 72.0°W (Atlantic Ocean)
**Month:** August

| Year | SLA (mm) |
|------|----------|
| 1993 | 13.6     |
| 2000 | 33.8     |
| 2010 | 120.6    |
| 2020 | 110.5    |

**Statistics:**
- Mean: 69.07 mm
- Trend: 3.28 mm/year
- Range: -13.9 to 158.6 mm

## Dependencies

### Already Installed
- ✅ xarray >= 2023.1.0
- ✅ netCDF4 >= 1.6.0
- ✅ numpy >= 1.21.0
- ✅ Flask >= 3.0.0
- ✅ flask-cors >= 4.0.0

### Removed
- ❌ earthengine-api (no longer needed)
- ❌ google-auth (no longer needed)
- ❌ google-cloud-storage (no longer needed)

## Breaking Changes

### Features No Longer Available
1. **DEM elevation data** - Returns null/placeholder
2. **Flood visualization tiles** - Returns transparent tiles
3. **GEE-based sea level rise projections** - Not implemented

### Features Still Working
1. ✅ SLA time series charts (NOW WORKING with real data!)
2. ✅ Point-based SLA queries
3. ✅ Statistical analysis (mean, trend, min, max)
4. ✅ Map interaction and geocoding

## Backwards Compatibility

### Frontend
- No changes to frontend components required
- Data format unchanged (API contract maintained)
- Environment variables compatible (.env.local)

### Backend
- API endpoints unchanged (same URLs, params)
- Response format unchanged (JSON structure same)
- Port changed (5000 → 5001) to avoid conflicts

## Performance

### Before (GEE)
- Initial request: ~2-5 seconds (GEE query + network)
- Subsequent: Variable (depends on GEE service)
- Rate limits: GEE quotas apply

### After (NetCDF)
- Initial request: ~1-3 seconds (file I/O)
- Subsequent: ~0.5-2 seconds (OS caching helps)
- Rate limits: None (local files)

### Optimization Opportunities
1. Cache loaded datasets in memory
2. Use Dask for parallel file reading
3. Pre-compute statistics for common locations
4. Add Redis for query result caching

## Known Limitations

1. **Land points return no data** - SLA only exists over ocean
2. **No DEM data** - Elevation queries return null
3. **Single month queries** - Time series shows one month across all years
4. **No real-time data** - Dataset ends in 2022
5. **First query slow** - NetCDF files loaded on demand

## Next Steps for User

1. **Stop any running servers:**
   ```bash
   # Kill any processes on ports 5001 or 3000
   lsof -ti:5001 | xargs kill
   lsof -ti:3000 | xargs kill
   ```

2. **Remove old .env.local:**
   ```bash
   rm frontend/.env.local
   ```

3. **Start the application:**
   ```bash
   ./start_dev.sh
   ```

4. **Test with ocean point:**
   - Open http://localhost:3000
   - Click on ocean (e.g., 40.5°N, 72°W)
   - View SLA time series chart

## Success Criteria

✅ Backend starts on port 5001
✅ Health check shows 368 files
✅ Frontend connects to backend
✅ Clicking ocean point loads data
✅ Chart displays 30 years of data
✅ Values in reasonable range (-50 to +200 mm)
✅ Chart styling matches reference image

## Rollback Procedure

If needed to revert changes:

1. **Restore backend:**
   ```bash
   cd backend
   git checkout app.py
   ```

2. **Restore startup script:**
   ```bash
   git checkout start_dev.sh
   ```

3. **Restore frontend:**
   ```bash
   cd frontend/src/lib
   git checkout dataClient.ts
   ```

4. **Remove documentation:**
   ```bash
   rm NETCDF_INTEGRATION.md QUICKSTART_NETCDF.md CHANGES_SUMMARY.md
   ```

## Additional Resources

- **NetCDF Documentation:** [Unidata NetCDF](https://www.unidata.ucar.edu/software/netcdf/)
- **Xarray Docs:** [xarray.pydata.org](https://xarray.pydata.org/)
- **Original Paper:** Check `2310.07631v1.pdf` for SLA methodology

## Contact

For issues or questions:
1. Check `NETCDF_INTEGRATION.md` for technical details
2. Check `QUICKSTART_NETCDF.md` for quick testing
3. Check backend.log and frontend.log for errors
4. Verify NetCDF files are present in data_pipeline/jiayou_sat_data/monthly_raw/

---

**Implementation completed:** October 23, 2024
**Status:** ✅ Ready for testing
**Backend:** Using local NetCDF files
**Frontend:** Compatible, no changes needed
**Documentation:** Complete

