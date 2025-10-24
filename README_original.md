# Coastal Flood Viewer

A production-grade, public web tool for visualizing coastal flood risks, sea level anomalies, and hurricane impacts.

## Architecture

This is a monorepo containing:

- **`frontend/`** - Next.js (App Router) + TypeScript + Tailwind + Leaflet web application
- **`backend/`** - Python Flask API for Google Earth Engine integration
- **`data_pipeline/`** - Python scripts for processing satellite data and generating visualization assets
- **`infra/`** - Infrastructure configuration and deployment scripts
- **`docs/`** - Documentation and architecture diagrams

## Quick Start

### Easy Development Setup (Recommended)

Use the provided startup script to run both backend and frontend:

```bash
cd coastal-flood-viewer
./start_dev.sh
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend app on `http://localhost:3000`

### Manual Setup

#### 1. Backend (Google Earth Engine API)

```bash
cd backend

# Activate your virtual environment
source ~/path/to/ams585venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Authenticate with Google Earth Engine (first time only)
earthengine authenticate

# Start the backend server
python app.py
```

Backend runs on `http://localhost:5000`

#### 2. Frontend Development

```bash
cd frontend
npm install

# Create environment configuration
cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF

# Start the development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Testing the Integration

```bash
# In a separate terminal, test the backend
cd backend
python test_backend.py
```

See [SETUP_GEE.md](SETUP_GEE.md) for detailed setup instructions and troubleshooting.

## Features

- **Sea Level Explorer** - Interactive visualization of sea level anomalies over time
- **Coastal Elevation & Flood Mapper** - DEM visualization with flood depth overlays
- **Hurricane Impact Simulator** - Storm track visualization with impact zones
- **Data Catalog** - Metadata browser for available datasets

## Data Sources

- **Elevation**: Coastal DEM from Google Earth Engine (`users/amanaryya1/coastal-dem-files`)
- **Sea Level Anomaly**: Climate AI team's processed satellite altimetry data (1993-2022) from NetCDF files
- **Hurricane Tracks**: IBTrACS v4.0 from NOAA
- **Projections**: NOAA sea level rise scenarios

All elevation and sea level data is fetched in real-time from Google Earth Engine through the backend API.

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Leaflet
- **Backend**: Python Flask, Google Earth Engine API
- **Maps**: React Leaflet, GeoTIFF, GeoRaster
- **State**: Zustand, Zod
- **Charts**: ECharts
- **Testing**: Vitest, Playwright
- **Deployment**: GitHub Pages (frontend), Google Cloud Run (backend)

## License

MIT License - see [LICENSE](LICENSE) file for details.
