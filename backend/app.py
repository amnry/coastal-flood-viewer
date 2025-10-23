"""
Coastal Flood Viewer Backend API
Flask API service that provides access to Sea Level Anomaly data from local NetCDF files
"""

import os
from pathlib import Path
from flask import Flask, request, jsonify, redirect, send_file
from flask_cors import CORS
import xarray as xr
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# ==================== Data Paths ====================

# Path to the NetCDF files
# The files are located relative to this backend directory
BACKEND_DIR = Path(__file__).parent
DATA_DIR = BACKEND_DIR.parent / "data_pipeline" / "jiayou_sat_data" / "monthly_raw"

print(f"📁 Looking for NetCDF files in: {DATA_DIR}")

if not DATA_DIR.exists():
    print(f"⚠️ Warning: Data directory does not exist: {DATA_DIR}")
else:
    # Count files for verification
    nc_files = list(DATA_DIR.glob("*.nc"))
    print(f"✅ Found {len(nc_files)} NetCDF files")

# ==================== NetCDF Data Functions ====================

def get_netcdf_filepath(year: int, month: int) -> Path:
    """
    Get the path to a NetCDF file for a specific year and month
    File naming convention: dt_global_twosat_phy_l4_YYYYMM_vDT2021-M01.nc
    """
    month_str = f"{month:02d}"
    filename = f"dt_global_twosat_phy_l4_{year}{month_str}_vDT2021-M01.nc"
    filepath = DATA_DIR / filename
    return filepath

def extract_sla_at_point(filepath: Path, lat: float, lon: float) -> float | None:
    """
    Extract SLA value at a specific lat/lon from a NetCDF file
    Returns value in millimeters (mm)
    """
    try:
        # Open the NetCDF file
        ds = xr.open_dataset(filepath)
        
        # Convert longitude from -180/180 to 0/360 if necessary
        # NetCDF files use 0-360 longitude convention
        lon_360 = lon if lon >= 0 else lon + 360
        
        # The dataset should have 'sla' variable with dimensions (time, latitude, longitude)
        # Use sel with method='nearest' to find the closest grid point
        sla_data = ds['sla'].sel(latitude=lat, longitude=lon_360, method='nearest')
        
        # If there's a time dimension, take the first (and likely only) time step
        if 'time' in sla_data.dims:
            sla_data = sla_data.isel(time=0)
        
        # Extract the value (in meters)
        sla_value_m = float(sla_data.values)
        
        # Close the dataset
        ds.close()
        
        # Handle NaN values
        if np.isnan(sla_value_m):
            return None
            
        # Convert from meters to millimeters
        return sla_value_m * 1000.0
        
    except Exception as e:
        print(f"Error extracting SLA from {filepath}: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_timeseries_for_point(lat: float, lon: float, month: int) -> list:
    """
    Get time series of SLA values for a specific lat/lon and month across all years (1993-2022)
    Returns list of dicts with 'date' and 'value' (in mm)
    """
    years = range(1993, 2023)  # 1993 to 2022
    timeseries = []
    
    for year in years:
        filepath = get_netcdf_filepath(year, month)
        
        if not filepath.exists():
            print(f"Warning: File not found: {filepath}")
            # Add a data point with None value to maintain continuity
            date_str = f"{year}-{month:02d}-15"
            timeseries.append({'date': date_str, 'value': None})
            continue
        
        sla_value = extract_sla_at_point(filepath, lat, lon)
        
        # Format the date string
        date_str = f"{year}-{month:02d}-15"
        
        timeseries.append({
            'date': date_str,
            'value': round(sla_value, 2) if sla_value is not None else None
        })
    
    return timeseries

# ==================== API Endpoints ====================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    nc_files = list(DATA_DIR.glob("*.nc")) if DATA_DIR.exists() else []
    return jsonify({
        'status': 'healthy',
        'service': 'Coastal Flood Viewer API',
        'data_files_available': len(nc_files),
        'data_directory': str(DATA_DIR)
    })

@app.route('/api/elevation', methods=['GET'])
def get_elevation():
    """
    Get elevation at a specific point
    Query params: lat, lon, scale (optional)
    Note: DEM functionality removed - using local NetCDF files only
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        
        # For now, return a placeholder since we're focusing on SLA data
        # This can be implemented later with local DEM files
        return jsonify({
            'lat': lat,
            'lon': lon,
            'elevation': None,
            'unit': 'meters',
            'source': 'Not available - using NetCDF SLA data only',
            'message': 'DEM data not available in this version'
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get elevation',
            'message': str(e)
        }), 500

@app.route('/api/sea-level', methods=['GET'])
def get_sea_level():
    """
    Get sea level anomaly at a specific point and time
    Query params: lat, lon, year, month
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        year = int(request.args.get('year', '2020'))
        month = int(request.args.get('month', '1'))
        
        # Get the NetCDF file path
        filepath = get_netcdf_filepath(year, month)
        
        if not filepath.exists():
            return jsonify({
                'error': 'Data not available',
                'message': f'No data file found for {year}-{month:02d}'
            }), 404
        
        # Extract SLA value at the point
        sla_value = extract_sla_at_point(filepath, lat, lon)
        
        return jsonify({
            'lat': lat,
            'lon': lon,
            'year': year,
            'month': month,
            'seaLevel': sla_value,
            'unit': 'mm',
            'source': 'Local NetCDF files',
            'file': filepath.name
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get sea level',
            'message': str(e)
        }), 500

@app.route('/api/timeseries', methods=['GET'])
def get_timeseries():
    """
    Get time series of sea level anomaly for a specific point and month
    Query params: lat, lon, month
    Returns SLA time series from 1993-2022 for the specified month
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        month = int(request.args.get('month', '1'))
        
        print(f"📊 Fetching time series for ({lat}, {lon}) for month {month}")
        
        # Get time series data from NetCDF files
        timeseries_data = get_timeseries_for_point(lat, lon, month)
        
        # Filter out None values for cleaner data
        valid_data = [d for d in timeseries_data if d['value'] is not None]
        
        if not valid_data:
            return jsonify({
                'error': 'No valid data found',
                'message': f'No SLA data available for location ({lat}, {lon})'
            }), 404
        
        print(f"✅ Found {len(valid_data)} data points")
        
        return jsonify({
            'data': valid_data,
            'unit': 'mm',
            'variable': 'Sea Level Anomaly',
            'location': {'lat': lat, 'lon': lon},
            'source': 'Local NetCDF files'
        })
        
    except Exception as e:
        print(f"❌ Error in get_timeseries: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to get time series',
            'message': str(e)
        }), 500

@app.route('/api/point-analytics', methods=['GET'])
def get_point_analytics():
    """
    Get comprehensive analytics for a point (elevation + sea level + time series)
    Query params: lat, lon, year (optional), month (optional)
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        year = int(request.args.get('year', '2020'))
        month = int(request.args.get('month', '1'))
        
        print(f"📍 Point analytics for ({lat}, {lon}) - {year}-{month:02d}")
        
        # Get current SLA value
        filepath = get_netcdf_filepath(year, month)
        sea_level = None
        if filepath.exists():
            sea_level = extract_sla_at_point(filepath, lat, lon)
        
        # Get time series data from NetCDF files
        timeseries_data = get_timeseries_for_point(lat, lon, month)
        
        # Filter out None values for statistics calculation
        valid_data = [d for d in timeseries_data if d['value'] is not None]
        
        if not valid_data:
            return jsonify({
                'error': 'No valid data found',
                'message': f'No SLA data available for location ({lat}, {lon})'
            }), 404
        
        # Calculate statistics
        values_mm = [d['value'] for d in valid_data]
        values_mm_sorted = sorted(values_mm)
        mean_val = sum(values_mm) / len(values_mm)
        median_val = values_mm_sorted[len(values_mm_sorted) // 2]
        min_val = min(values_mm)
        max_val = max(values_mm)
        
        # Calculate trend (simple linear regression)
        # Using years as x and values as y
        years = [int(d['date'].split('-')[0]) for d in valid_data]
        n = len(years)
        if n > 1:
            sum_x = sum(years)
            sum_y = sum(values_mm)
            sum_xy = sum(x * y for x, y in zip(years, values_mm))
            sum_x2 = sum(x * x for x in years)
            
            # Slope of linear regression (trend in mm/year)
            trend = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
        else:
            trend = 0.0
        
        # Recent change (last 5 years vs first 5 years average)
        if len(values_mm) >= 10:
            recent_avg = sum(values_mm[-5:]) / 5
            early_avg = sum(values_mm[:5]) / 5
            recent_change = recent_avg - early_avg
        else:
            recent_change = 0.0
        
        print(f"✅ Analytics calculated: mean={mean_val:.2f}mm, trend={trend:.2f}mm/yr")
        
        return jsonify({
            'lat': lat,
            'lon': lon,
            'elevation': None,  # DEM not available in this version
            'seaLevel': sea_level,
            'timeSeries': {
                'data': valid_data,
                'unit': 'mm',
                'variable': 'Sea Level Anomaly',
                'location': {'lat': lat, 'lon': lon}
            },
            'stats': {
                'mean': round(mean_val, 2),
                'median': round(median_val, 2),
                'min': round(min_val, 2),
                'max': round(max_val, 2),
                'trend': round(trend, 2),
                'recentChange': round(recent_change, 2)
            },
            'source': {
                'dem': 'Not available',
                'sla': 'Local NetCDF files'
            }
        })
        
    except Exception as e:
        print(f"❌ Error in get_point_analytics: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to get point analytics',
            'message': str(e)
        }), 500

@app.route('/api/flood-tiles/<int:z>/<int:x>/<int:y>.png', methods=['GET'])
def get_flood_tiles(z, x, y):
    """
    Flood tile generation - Not available in NetCDF-only version
    Returns transparent tile
    """
    # Return a transparent 1x1 PNG
    import base64
    from io import BytesIO
    transparent_png = base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    )
    return send_file(BytesIO(transparent_png), mimetype='image/png')

@app.route('/api/dem-tiles/<int:z>/<int:x>/<int:y>.png', methods=['GET'])
def get_dem_tiles(z, x, y):
    """
    DEM tile generation - Not available in NetCDF-only version
    Returns transparent tile
    """
    # Return a transparent 1x1 PNG
    import base64
    from io import BytesIO
    transparent_png = base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    )
    return send_file(BytesIO(transparent_png), mimetype='image/png')

@app.route('/api/slr-tiles/<int:z>/<int:x>/<int:y>.png', methods=['GET'])
def get_slr_tiles(z, x, y):
    """
    SLR tile generation - Not available in NetCDF-only version
    Returns transparent tile
    """
    # Return a transparent 1x1 PNG
    import base64
    from io import BytesIO
    transparent_png = base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    )
    return send_file(BytesIO(transparent_png), mimetype='image/png')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

