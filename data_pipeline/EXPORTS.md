# Data Pipeline Exports

This document describes the expected outputs from the data processing pipeline for the Coastal Flood Viewer.

## Output Structure

All processed data is stored in Google Cloud Storage (GCS) with the following structure:

```
gs://coastal-flood-viewer-tiles/
├── tiles/
│   ├── slr/           # Sea Level Anomaly tiles
│   │   └── {z}/{x}/{y}.png
│   └── flood/         # Flood depth tiles
│       └── {z}/{x}/{y}.png
├── cogs/              # Cloud Optimized GeoTIFFs
│   └── dem/
│       └── *.tif
├── vector/            # Vector data
│   └── ibtracs_subset.geojson
└── catalog/           # Metadata
    └── catalog.json
```

## Data Products

### 1. Sea Level Anomaly Tiles

**Path:** `gs://coastal-flood-viewer-tiles/tiles/slr/{z}/{x}/{y}.png`

- **Source:** Climate AI team's processed satellite altimetry data (1993-2022)
- **Processing:** Monthly SLA data processed into web tiles
- **Format:** PNG tiles in Web Mercator projection
- **Zoom Levels:** 0-12
- **Coverage:** Global coastal areas
- **Time Period:** 1993-2022

### 2. Flood Depth Tiles

**Path:** `gs://coastal-flood-viewer-tiles/tiles/flood/{z}/{x}/{y}.png`

- **Source:** DEM + sea level rise scenarios
- **Processing:** Flood depth calculated for different SLR scenarios
- **Format:** PNG tiles in Web Mercator projection
- **Zoom Levels:** 0-12
- **Coverage:** US coastal areas
- **Scenarios:** 0m, 0.5m, 1m, 1.5m, 2m additional SLR

### 3. Digital Elevation Model (COGs)

**Path:** `gs://coastal-flood-viewer-tiles/cogs/dem/*.tif`

- **Source:** Google Earth Engine asset `users/amanaryya1/coastal-dem-files`
- **Processing:** Exported as Cloud Optimized GeoTIFFs
- **Format:** GeoTIFF with internal tiling
- **Coverage:** US coastal areas
- **Resolution:** Variable (1m-30m depending on source)

### 4. Hurricane Track Data

**Path:** `gs://coastal-flood-viewer-tiles/vector/ibtracs_subset.geojson`

- **Source:** IBTrACS v4.0
- **Processing:** Simplified tracks for web visualization
- **Format:** GeoJSON FeatureCollection
- **Coverage:** Global
- **Time Period:** 1851-2023
- **Filtering:** Tropical storms and hurricanes only

## Processing Pipeline

### 1. Sea Level Data Processing

```bash
# Process satellite data
python sa_data.py --output-dir output/sla --years 1993-2022

# Generate tiles
python generate_tiles.py --input output/sla --output gs://bucket/tiles/slr
```

### 2. DEM Processing

```bash
# Export from GEE
python dem_processing.py --asset users/amanaryya1/coastal-dem-files

# Generate tiles
python generate_tiles.py --input output/dem --output gs://bucket/tiles/dem
```

### 3. Hurricane Data Processing

```bash
# Download and process IBTrACS
python hurricane_data.py --output-dir output/hurricanes

# Upload to GCS
gsutil cp output/hurricanes/ibtracs_subset.geojson gs://bucket/vector/
```

## Data Access

### Public Access

- **Tiles:** Public read access via CDN
- **COGs:** Public read access via CDN
- **Vector Data:** Public read access via CDN

### Private Data

- **Raw NetCDF files:** Private (not in public bucket)
- **Processing scripts:** Private (in repository)
- **Credentials:** Private (not in repository)

## CDN Configuration

All public data is served via Cloud CDN with:

- **CORS:** Enabled for web access
- **Caching:** 24 hours for tiles, 7 days for metadata
- **Compression:** Gzip enabled
- **Security:** HTTPS only

## Data Updates

- **SLA Tiles:** Monthly (when new satellite data available)
- **Flood Tiles:** When new DEM or SLR scenarios added
- **Hurricane Data:** Annually (when new IBTrACS data released)
- **Catalog:** Updated when any data product changes

## Quality Assurance

- **Validation:** All outputs validated against schema
- **Testing:** Automated tests for data integrity
- **Monitoring:** Cloud Logging for processing status
- **Backup:** Object versioning enabled on bucket
