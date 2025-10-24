# Coastal Flood Viewer Backend API

Flask-based API service that provides access to Google Earth Engine data for the Coastal Flood Viewer application.

## Features

- **Elevation Data**: Query elevation at any point from the CoastalDEM (`users/amanaryya1/coastal-dem-files`)
- **Sea Level Anomaly**: Get SLA data for specific locations and time periods
- **Time Series**: Retrieve historical sea level anomaly time series data
- **Point Analytics**: Get comprehensive analytics including elevation, sea level, and statistics

## Installation

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Authenticate with Google Earth Engine**:
   ```bash
   earthengine authenticate
   ```

## Running the Server

### Development Mode

```bash
python app.py
```

The server will start on `http://localhost:5000`

### Production Mode

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### Health Check
```
GET /health
```

### Get Elevation
```
GET /api/elevation?lat={latitude}&lon={longitude}&scale={scale}
```
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `scale`: Resolution in meters (optional, default: 300)

**Example Response:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "elevation": 3.5,
  "unit": "meters",
  "source": "users/amanaryya1/coastal-dem-files",
  "scale": 300
}
```

### Get Sea Level
```
GET /api/sea-level?lat={latitude}&lon={longitude}&year={year}&month={month}
```
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `year`: Year (optional, default: 2020)
- `month`: Month as 01-12 (optional, default: 01)
- `scale`: Resolution in meters (optional, default: 5000)

**Example Response:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "year": 2020,
  "month": 1,
  "seaLevel": 0.025,
  "unit": "meters",
  "source": "projects/sea-level-analysis/assets/Jiayou",
  "scale": 5000
}
```

### Get Time Series
```
GET /api/timeseries?lat={latitude}&lon={longitude}&month={month}
```
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `month`: Month as 01-12 (optional, default: 01)
- `scale`: Resolution in meters (optional, default: 5000)

**Example Response:**
```json
{
  "data": [
    {"date": "1993-01-15", "value": -15.3},
    {"date": "1994-01-15", "value": -12.1},
    ...
  ],
  "unit": "mm",
  "variable": "Sea Level Anomaly",
  "location": {"lat": 40.7128, "lon": -74.0060},
  "source": "projects/sea-level-analysis/assets/Jiayou"
}
```

### Get Point Analytics
```
GET /api/point-analytics?lat={latitude}&lon={longitude}&year={year}&month={month}
```
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `year`: Year (optional, default: 2020)
- `month`: Month as 01-12 (optional, default: 01)
- `scale`: Resolution in meters (optional, default: 300)

**Example Response:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "elevation": 3.5,
  "seaLevel": 25.0,
  "timeSeries": {
    "data": [...],
    "unit": "mm",
    "variable": "Sea Level Anomaly",
    "location": {"lat": 40.7128, "lon": -74.0060}
  },
  "stats": {
    "mean": 15.5,
    "median": 14.2,
    "min": -45.3,
    "max": 78.1,
    "trend": 2.1,
    "recentChange": 8.5
  },
  "source": {
    "dem": "users/amanaryya1/coastal-dem-files",
    "sla": "projects/sea-level-analysis/assets/Jiayou"
  }
}
```

## Configuration

The backend uses the following Google Earth Engine assets:
- **DEM**: `users/amanaryya1/coastal-dem-files`
- **Sea Level Anomaly**: `projects/sea-level-analysis/assets/Jiayou/sla_{year}-{month}-15`

Make sure you have access to these assets through your GEE account.

## CORS

CORS is enabled for all origins to allow the frontend to access the API. In production, you should restrict this to your frontend domain.

## Deployment

This backend can be deployed to:
- **Google Cloud Run**
- **Heroku**
- **AWS Lambda** (with modifications)
- **Any server** with Python support

For production deployment, make sure to:
1. Use a production WSGI server (gunicorn is included)
2. Configure proper CORS restrictions
3. Set up monitoring and logging
4. Use environment variables for configuration
5. Implement rate limiting if needed

