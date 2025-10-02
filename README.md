# Coastal Flood Viewer

A production-grade, public web tool for visualizing coastal flood risks, sea level anomalies, and hurricane impacts.

## Architecture

This is a monorepo containing:

- **`frontend/`** - Next.js (App Router) + TypeScript + Tailwind + Leaflet web application
- **`data_pipeline/`** - Python scripts for processing satellite data and generating visualization assets
- **`infra/`** - Infrastructure configuration and deployment scripts
- **`docs/`** - Documentation and architecture diagrams

## Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Data Pipeline

```bash
cd data_pipeline
pip install -r requirements.txt
python sa_data.py --help
```

## Features

- **Sea Level Explorer** - Interactive visualization of sea level anomalies over time
- **Coastal Elevation & Flood Mapper** - DEM visualization with flood depth overlays
- **Hurricane Impact Simulator** - Storm track visualization with impact zones
- **Data Catalog** - Metadata browser for available datasets

## Data Sources

- Satellite altimetry data (Jason-1, Jason-2, Jason-3)
- Coastal DEM from Google Earth Engine
- IBTrACS hurricane track data
- NOAA sea level rise projections

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Leaflet
- **Maps**: React Leaflet, GeoTIFF, GeoRaster
- **State**: Zustand, Zod
- **Charts**: ECharts
- **Testing**: Vitest, Playwright
- **Deployment**: Cloudflare Pages

## License

MIT License - see [LICENSE](LICENSE) file for details.
