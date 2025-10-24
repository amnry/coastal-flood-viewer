# Coastal Flood Viewer

A modern web application for visualizing coastal flood risks, sea level anomalies, and hurricane impacts using real-world data from Climate AI team and Google Earth Engine.

🌐 **Live Demo**: [https://amnry.github.io/coastal-flood-viewer/](https://amnry.github.io/coastal-flood-viewer/)

## Features

### 🌊 **Flood Mapper**
- **Coastal DEM**: Digital elevation model from Google Earth Engine
- **Sea Level Anomaly**: 30 years (1993-2022) of SLA data from Climate AI team
- **Flood Depth**: Combined DEM + SLA + scenario modeling
- **Time Controls**: Year/month selection with historical data
- **Scenario Modeling**: Additional sea level rise (0-5m)
- **Interactive Charts**: Time series visualization with trend analysis

### 🌀 **Hurricane Impact**
- **Storm Tracks**: Historical hurricane data visualization
- **Impact Zones**: Wind speed and storm surge analysis
- **Interactive Filters**: Search by storm name, year, category

## Quick Start

### Option 1: One Command (Recommended)
```bash
cd coastal-flood-viewer
./start_dev.sh
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
source ~/path/to/ams585venv/bin/activate
pip install -r requirements.txt
python app.py  # Runs on port 5001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # Runs on port 3000
```

### First-Time Setup (Google Earth Engine)
```bash
source ~/path/to/ams585venv/bin/activate
earthengine authenticate
```

## Architecture

### Backend (Flask API)
- **Port**: 5001 (changed from 5000 to avoid macOS conflicts)
- **Core Endpoints**: 
  - `/api/point-analytics` - Get elevation, SLA, and time series
  - `/api/timeseries` - Get historical SLA data (1993-2022)
  - `/api/sea-level` - Get current SLA at a point
  - `/api/elevation` - Get DEM elevation
- **Data Sources**: 
  - **DEM**: Google Earth Engine (`users/amanaryya1/coastal-dem-files`)
  - **SLA**: NetCDF files from Climate AI team (368 monthly files, 1993-2022)
- **Technology**: Flask + xarray + NetCDF4

### Frontend (Next.js)
- **Port**: 3000
- **Pages**: Home, Flood Mapper, Hurricane Impact, About
- **Components**: Modular React components with TypeScript
- **State**: Zustand store for app state management
- **Maps**: React Leaflet with dynamic tile layers
- **Deployment**: GitHub Pages (static export)

## Data Sources

### Sea Level Anomaly (SLA)
- **Source**: Climate AI team's processed satellite altimetry data
- **Format**: NetCDF files (dt_global_twosat_phy_l4_*.nc)
- **Coverage**: Global ocean, 1993-2022 (30 years)
- **Resolution**: ~25km grid
- **Variables**: sla (Sea Level Anomaly), eke (Eddy Kinetic Energy)
- **Location**: `data_pipeline/jiayou_sat_data/monthly_raw/`

### Digital Elevation Model (DEM)
- **Source**: Coastal DEM from Google Earth Engine
- **Asset**: `users/amanaryya1/coastal-dem-files`
- **Coverage**: US coastal areas
- **Resolution**: ~30m

## Deployment

### Production (GitHub Pages)

The application is deployed using GitHub Pages with automated GitHub Actions:

**Frontend Deployment:**
```bash
# Automatic deployment on push to main
git push origin main
```

The `.github/workflows/deploy.yml` workflow handles:
- Building Next.js static export
- Deploying to GitHub Pages
- Managing cache and dependencies

**Backend Deployment Options:**
- Google Cloud Run (recommended for GEE integration)
- Heroku
- AWS Lambda

See [MIGRATION_TO_GITHUB_PAGES.md](MIGRATION_TO_GITHUB_PAGES.md) for detailed deployment information.

### Local Development

```bash
# Start both backend and frontend
./start_dev.sh

# Backend: http://localhost:5001
# Frontend: http://localhost:3000
```

## Testing

```bash
# Test backend API
cd backend
python test_backend.py

# Test frontend
cd frontend
npm test

# Integration tests
python test_integration.py
```

## Data Flow

```
User clicks map
    ↓
Frontend (Next.js) → Backend API (Flask)
    ↓
Backend reads:
    ├── Google Earth Engine (DEM)
    └── NetCDF files (SLA from Climate AI team)
    ↓
Returns JSON with elevation, SLA, time series
    ↓
Frontend displays interactive charts and visualizations
```

## Project Structure

```
coastal-flood-viewer/
├── backend/
│   ├── app.py              # Flask API with GEE + NetCDF
│   ├── requirements.txt    # Python dependencies
│   └── test_backend.py     # Backend tests
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Data client & utilities
│   │   └── store/          # Zustand state management
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── data_pipeline/
│   └── jiayou_sat_data/    # NetCDF files from Climate AI team
├── .github/
│   └── workflows/          # GitHub Actions (deployment)
├── docs/                   # Documentation
└── start_dev.sh           # Convenience startup script
```

## Key Features

- ✅ **Real Data Integration**: Climate AI team's SLA data + Google Earth Engine DEM
- ✅ **30 Years of History**: Complete time series from 1993-2022
- ✅ **Interactive Visualization**: Click anywhere on the map for point analytics
- ✅ **Time Series Charts**: Trend analysis with mean, min, max statistics
- ✅ **Scenario Modeling**: Explore future sea level rise scenarios (0-5m)
- ✅ **Hurricane Tracking**: Historical storm data and impact zones
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Modern Stack**: Next.js, TypeScript, React, Flask
- ✅ **Automated Deployment**: GitHub Actions to GitHub Pages

## Recent Updates

### October 2024
- ✅ Integrated Climate AI team's NetCDF data (replaced previous data sources)
- ✅ Migrated deployment from Cloudflare Pages to GitHub Pages
- ✅ Added Google Earth Engine integration for DEM data
- ✅ Implemented real-time SLA time series charts
- ✅ Updated backend port to 5001 (macOS compatibility)
- ✅ Enhanced frontend with TypeScript and improved state management
- ✅ Added comprehensive documentation and testing

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP_GEE.md](SETUP_GEE.md)** - Google Earth Engine setup guide
- **[NETCDF_INTEGRATION.md](NETCDF_INTEGRATION.md)** - NetCDF data integration details
- **[MIGRATION_TO_GITHUB_PAGES.md](MIGRATION_TO_GITHUB_PAGES.md)** - Deployment guide
- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Feature implementation summary
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[docs/DATA.md](docs/DATA.md)** - Data sources and formats

## Requirements

### Backend
- Python 3.8+
- Google Earth Engine account (for DEM data)
- Dependencies: Flask, xarray, netCDF4, earthengine-api

### Frontend
- Node.js 18+
- npm or yarn
- Modern web browser

## Troubleshooting

### Backend Won't Start
- Check if port 5001 is available: `lsof -ti:5001`
- Verify virtual environment is activated
- Run `earthengine authenticate` if GEE fails

### Data Not Loading
- Ensure NetCDF files exist in `data_pipeline/jiayou_sat_data/monthly_raw/`
- Click on ocean points (SLA data only available over water)
- Check backend logs: `tail -f backend.log`

### Frontend Build Issues
- Clear cache: `rm -rf frontend/.next frontend/node_modules`
- Reinstall: `npm install`
- Verify .env.local has correct backend URL

## Contributing

See the various documentation files for implementation details and architecture.

## License

See [LICENSE](LICENSE) file for details.

---

**Built with real data from Climate AI team and Google Earth Engine**

For questions or issues, please check the documentation or create an issue on GitHub.
