# Quick Start Guide

Get the Coastal Flood Viewer running with real Google Earth Engine data in 5 minutes!

## Prerequisites Check

- [ ] Python 3.8+ installed: `python3 --version`
- [ ] Node.js 18+ installed: `node --version`
- [ ] Google Earth Engine access (you already have this!)

## 1-Command Setup

```bash
cd /Users/amanarya/Library/Mobile\ Documents/com~apple~CloudDocs/AMS585/coastal-flood-viewer
./start_dev.sh
```

That's it! The script will:
- Activate your ams585venv
- Install dependencies
- Start the backend on http://localhost:5000
- Start the frontend on http://localhost:3000

## First-Time Setup Only

If this is your first time, you need to authenticate with Google Earth Engine:

```bash
# Activate your virtual environment
source ~/Library/Mobile\ Documents/com~apple~CloudDocs/AMS585/ams585venv/bin/activate

# Authenticate with Google Earth Engine
earthengine authenticate
```

Follow the browser prompts to authorize. You only need to do this once.

## Manual Start (Alternative)

If you prefer to run the servers separately:

### Terminal 1 - Backend
```bash
cd coastal-flood-viewer/backend
source ~/Library/Mobile\ Documents/com~apple~CloudDocs/AMS585/ams585venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Terminal 2 - Frontend
```bash
cd coastal-flood-viewer/frontend
npm install
echo 'NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_DATA=false' > .env.local
npm run dev
```

## Using the App

1. **Open your browser**: http://localhost:3000

2. **Navigate to a page**:
   - Flood Mapper
   - Explorer
   - Hurricane Impact

3. **Click on the map**:
   - Click anywhere on the map
   - Wait 2-3 seconds for GEE to process
   - See real elevation and sea level data!

4. **Verify real data**:
   - Elevation values should be realistic for the location
   - Time series chart shows data from 1993-2022
   - No more random mock values!

## Testing the Backend

```bash
cd backend
python test_backend.py
```

Expected output:
```
✅ All 5 tests passed!
✅ Backend is working correctly with Google Earth Engine!
```

## Stopping the Servers

If you used `./start_dev.sh`:
- Press `Ctrl+C` in the terminal

If you ran manually:
- Press `Ctrl+C` in each terminal window

## Common Issues

### "Cannot connect to backend"
**Fix**: Make sure the backend is running on port 5000
```bash
curl http://localhost:5000/health
```

### "Earth Engine failed to initialize"
**Fix**: Run authentication again
```bash
earthengine authenticate
```

### Port 3000 or 5000 already in use
**Fix**: Kill the process using that port
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill
lsof -ti:3000 | xargs kill
```

## What's Happening Behind the Scenes

When you click on the map:

1. **Frontend** sends your click location to the backend
2. **Backend** queries Google Earth Engine:
   - Gets elevation from `users/amanaryya1/coastal-dem-files`
   - Gets sea level from `projects/sea-level-analysis/assets/Jiayou`
   - Gets historical data from 1993-2022
3. **Backend** returns real data to the frontend
4. **Frontend** displays:
   - Elevation at that point
   - Current sea level anomaly
   - Time series chart
   - Statistics (mean, median, min, max)

## Next Steps

- Read [SETUP_GEE.md](SETUP_GEE.md) for detailed documentation
- Read [GEE_INTEGRATION_SUMMARY.md](GEE_INTEGRATION_SUMMARY.md) for implementation details
- Check [backend/README.md](backend/README.md) for API documentation

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main web app |
| Backend | http://localhost:5000 | GEE API |
| Health Check | http://localhost:5000/health | Verify backend is running |
| API Elevation | http://localhost:5000/api/elevation?lat=40.7&lon=-74 | Get elevation |
| API Sea Level | http://localhost:5000/api/sea-level?lat=40.7&lon=-74&year=2020&month=06 | Get SLA |

## Happy Mapping! 🗺️

Your app is now connected to real Google Earth Engine data, just like test_shreya_app.py!

