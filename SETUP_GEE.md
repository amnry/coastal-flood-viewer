# Google Earth Engine Integration Setup Guide

This guide will help you set up the Google Earth Engine (GEE) integration for the Coastal Flood Viewer application.

## Overview

The app now pulls real elevation data from your GEE ImageCollection asset: `users/amanaryya1/coastal-dem-files`

The architecture consists of:
- **Frontend**: Next.js app that displays the map and UI
- **Backend**: Python Flask API that queries Google Earth Engine

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 18+** and npm installed
3. **Google Earth Engine account** with access to:
   - `users/amanaryya1/coastal-dem-files` (DEM data)
   - `projects/sea-level-analysis/assets/Jiayou/sla_*` (Sea Level Anomaly data)

## Step 1: Authenticate with Google Earth Engine

First, authenticate your Google Earth Engine account:

```bash
# Activate your virtual environment (ams585venv)
source ~/path/to/ams585venv/bin/activate  # On macOS/Linux
# OR
ams585venv\Scripts\activate  # On Windows

# Install Earth Engine Python API if not already installed
pip install earthengine-api

# Authenticate with GEE
earthengine authenticate
```

This will open a browser window where you can authorize the Earth Engine API. Follow the prompts to complete authentication.

## Step 2: Set Up the Backend

```bash
# Navigate to the backend directory
cd coastal-flood-viewer/backend

# Install Python dependencies
pip install -r requirements.txt

# Test that Earth Engine is initialized
python -c "import ee; ee.Initialize(project='sea-level-analysis'); print('✅ GEE initialized successfully')"
```

## Step 3: Set Up the Frontend

```bash
# Navigate to the frontend directory
cd ../frontend

# Install Node dependencies (if not already installed)
npm install

# Create .env.local file for environment variables
cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF
```

## Step 4: Run the Application

You need to run both the backend and frontend servers.

### Terminal 1 - Backend Server:

```bash
cd coastal-flood-viewer/backend
source ~/path/to/ams585venv/bin/activate  # Activate your venv
python app.py
```

The backend will start on `http://localhost:5000`

### Terminal 2 - Frontend Server:

```bash
cd coastal-flood-viewer/frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 5: Test the Integration

1. Open your browser to `http://localhost:3000`
2. Navigate to the Flood Mapper or Explorer page
3. Click anywhere on the map
4. You should see:
   - **Real elevation data** from your GEE DEM asset
   - **Real sea level anomaly data** from the Jiayou dataset
   - **Time series chart** showing historical SLA data from 1993-2022

## Troubleshooting

### Backend fails to start

**Error**: "Earth Engine failed to initialize"

**Solution**: Make sure you've run `earthengine authenticate` and completed the authentication flow.

### Frontend can't connect to backend

**Error**: "Failed to fetch point analytics: Failed to fetch"

**Solutions**:
1. Verify the backend is running on port 5000
2. Check that `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000` in your `.env.local` file
3. Check browser console for CORS errors (the backend has CORS enabled by default)

### Getting null elevation values

**Possible causes**:
1. The clicked point is outside the coverage of your DEM asset
2. The DEM asset has no data at that location
3. GEE quota limits (check the backend logs)

**Solution**: 
- Try clicking on coastal areas within the US where your DEM has coverage
- Check the GEE asset coverage in Google Earth Engine Code Editor

### Slow API responses

**Cause**: Earth Engine computations can take time, especially for complex queries

**Solutions**:
1. The backend uses `bestEffort=True` and `tileScale=4` to optimize queries
2. For production, consider implementing caching
3. Reduce the `scale` parameter for faster but lower-resolution results

## Production Deployment

For production deployment:

### Backend Options:
1. **Google Cloud Run**: Recommended for GEE integration
2. **Heroku**: Easy deployment with Python support
3. **AWS Lambda**: Requires modifications for serverless

### Frontend Options:
1. **GitHub Pages**: Free static site hosting with automatic deployment
2. **Vercel**: Optimal for Next.js (automatic deployment)
3. **Netlify**: Good alternative with continuous deployment

### Important Production Notes:

1. **Environment Variables**: Set proper environment variables in your hosting platform
   ```
   NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

2. **CORS Configuration**: Update the backend to only allow your frontend domain:
   ```python
   CORS(app, origins=['https://your-frontend-domain.com'])
   ```

3. **Rate Limiting**: Implement rate limiting to prevent API abuse

4. **Caching**: Add Redis or similar caching for frequently accessed locations

5. **Service Account**: For production, use a GEE Service Account instead of user authentication

## API Endpoints Reference

The backend provides these endpoints:

- `GET /health` - Health check
- `GET /api/elevation?lat={lat}&lon={lon}` - Get elevation at a point
- `GET /api/sea-level?lat={lat}&lon={lon}&year={year}&month={month}` - Get SLA at a point
- `GET /api/timeseries?lat={lat}&lon={lon}&month={month}` - Get SLA time series
- `GET /api/point-analytics?lat={lat}&lon={lon}&year={year}&month={month}` - Get all analytics

See `backend/README.md` for detailed API documentation.

## Testing with Mock Data

If you want to test the frontend without the backend:

```bash
# In frontend/.env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
```

This will use the mock data generation instead of calling the backend API.

## Verification Checklist

- [ ] Earth Engine authentication completed
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can click on map and see data loading
- [ ] Elevation values are realistic (not random)
- [ ] Sea level values are realistic (not random)
- [ ] Time series chart shows data from 1993-2022
- [ ] Backend logs show successful GEE queries

## Support

If you encounter issues:
1. Check the backend logs for GEE errors
2. Check the browser console for frontend errors
3. Verify your GEE assets are accessible
4. Ensure you're using the correct asset IDs in `backend/app.py`

