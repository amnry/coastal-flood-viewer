# Data Documentation

This document describes the data sources, processing, and storage for the Coastal Flood Viewer.

## Data Sources

### 1. Satellite Altimetry Data

**Source:** NOAA/NASA Satellite Altimetry Missions
- Jason-1 (2001-2013)
- Jason-2 (2008-2019)
- Jason-3 (2016-present)

**Data Type:** Sea Level Anomaly (SLA)
**Format:** NetCDF (.nc) files
**Coverage:** Global ocean
**Resolution:** ~25km spatial, monthly temporal
**Time Period:** 1993-2022

**Processing:**
- Raw NetCDF files processed with xarray
- Monthly SLA data extracted for specific locations
- Data tiled for web visualization
- Quality control and validation applied

### 2. Coastal Digital Elevation Model

**Source:** Google Earth Engine Asset
- Asset ID: `users/amanaryya1/coastal-dem-files`
- Multiple data sources combined
- LiDAR, satellite imagery, bathymetric surveys

**Data Type:** Digital Elevation Model (DEM)
**Format:** Cloud Optimized GeoTIFF (COG)
**Coverage:** US coastal areas
**Resolution:** 1m-30m (variable by source)
**Vertical Accuracy:** ±0.1m (LiDAR), ±1m (satellite)

**Processing:**
- Exported from Google Earth Engine
- Converted to COG format
- Tiled for web visualization
- Quality assessment performed

### 3. Hurricane Track Data

**Source:** International Best Track Archive for Climate Stewardship (IBTrACS)
- Version: IBTrACS v4.0
- Agency: NOAA National Centers for Environmental Information

**Data Type:** Hurricane and tropical cyclone tracks
**Format:** NetCDF and CSV
**Coverage:** Global
**Time Period:** 1851-2023
**Update Frequency:** Annual

**Processing:**
- Downloaded from NOAA IBTrACS website
- Filtered for tropical storms and hurricanes
- Tracks simplified for web visualization
- Converted to GeoJSON format
- Metadata added (category, wind speed, pressure)

### 4. Sea Level Rise Projections

**Source:** NOAA Sea Level Rise Viewer
- Global and Regional SLR scenarios
- IPCC AR6 projections
- Local sea level rise estimates

**Data Type:** Sea level rise scenarios
**Format:** Raster data
**Coverage:** US coastal areas
**Scenarios:** 0.5m, 1.0m, 1.5m, 2.0m additional SLR
**Time Horizon:** 2100

## Data Storage

### Google Cloud Storage (GCS)

**Bucket:** `coastal-flood-viewer-tiles`
**Location:** US (multi-region)
**Storage Class:** Standard
**Versioning:** Enabled
**Encryption:** At rest and in transit

### Directory Structure

```
gs://coastal-flood-viewer-tiles/
├── tiles/
│   ├── slr/                    # Sea Level Anomaly tiles
│   │   └── {z}/{x}/{y}.png    # Web Mercator tiles
│   └── flood/                  # Flood depth tiles
│       └── {z}/{x}/{y}.png    # Web Mercator tiles
├── cogs/                       # Cloud Optimized GeoTIFFs
│   └── dem/
│       ├── coastal_dem.tif     # Main DEM COG
│       └── regional_*.tif      # Regional DEM COGs
├── vector/                     # Vector data
│   ├── ibtracs_subset.geojson # Hurricane tracks
│   └── impact_zones.geojson   # Impact zones
└── catalog/                    # Metadata
    ├── catalog.json           # Dataset catalog
    └── metadata/              # Individual dataset metadata
        ├── sla_metadata.json
        ├── dem_metadata.json
        └── hurricane_metadata.json
```

### Access Control

**Public Access:**
- Tiles and COGs: Public read access
- Vector data: Public read access
- Metadata: Public read access

**Private Access:**
- Raw NetCDF files: Private (not in public bucket)
- Processing scripts: Private (in repository)
- Credentials: Private (not in repository)

## Data Processing Pipeline

### 1. Sea Level Anomaly Processing

**Script:** `data_pipeline/sa_data.py`

**Process:**
1. Load NetCDF files from `jiayou_sat_data/monthly_raw/`
2. Extract SLA data for specific coordinates
3. Generate time series for each location
4. Create monthly composite tiles
5. Upload tiles to GCS bucket

**Output:**
- Time series CSV files for specific locations
- Monthly SLA tiles in Web Mercator projection
- Metadata JSON files

### 2. DEM Processing

**Script:** `data_pipeline/dem_processing.py`

**Process:**
1. Export DEM from Google Earth Engine asset
2. Convert to Cloud Optimized GeoTIFF format
3. Generate tile pyramid for web visualization
4. Upload COGs and tiles to GCS bucket

**Output:**
- Cloud Optimized GeoTIFFs
- DEM tiles in Web Mercator projection
- Elevation metadata

### 3. Hurricane Data Processing

**Script:** `data_pipeline/hurricane_data.py`

**Process:**
1. Download IBTrACS data from NOAA
2. Filter and clean track data
3. Simplify tracks for web visualization
4. Calculate impact zones
5. Convert to GeoJSON format
6. Upload to GCS bucket

**Output:**
- Simplified hurricane tracks GeoJSON
- Impact zones GeoJSON
- Storm metadata

## Data Quality Assurance

### 1. Validation

**Automated Checks:**
- Data format validation
- Coordinate system verification
- Temporal consistency checks
- Spatial coverage validation
- Metadata completeness

**Manual Review:**
- Visual inspection of tiles
- Statistical analysis of time series
- Comparison with known values
- User feedback integration

### 2. Quality Metrics

**Sea Level Data:**
- Completeness: >95% for each month
- Accuracy: ±2cm compared to tide gauges
- Temporal consistency: No gaps >3 months
- Spatial coverage: Global ocean

**DEM Data:**
- Vertical accuracy: ±0.1m (LiDAR), ±1m (satellite)
- Completeness: >99% for coastal areas
- Spatial resolution: Appropriate for zoom levels
- Edge matching: Seamless between tiles

**Hurricane Data:**
- Completeness: All major storms included
- Accuracy: Track positions within 50km
- Temporal coverage: 1851-2023
- Metadata completeness: 100%

### 3. Error Handling

**Data Processing:**
- Graceful handling of missing data
- Logging of processing errors
- Automatic retry mechanisms
- Fallback to previous versions

**Web Application:**
- Error boundaries for data loading
- Fallback to mock data during development
- User-friendly error messages
- Automatic retry for failed requests

## Data Updates

### Update Schedule

**Sea Level Data:**
- Frequency: Monthly
- Trigger: New satellite data available
- Processing time: 2-4 hours
- Deployment: Automatic

**DEM Data:**
- Frequency: As needed
- Trigger: New elevation data available
- Processing time: 4-8 hours
- Deployment: Manual

**Hurricane Data:**
- Frequency: Annually
- Trigger: New IBTrACS release
- Processing time: 1-2 hours
- Deployment: Manual

### Version Control

**Data Versioning:**
- GCS object versioning enabled
- Semantic versioning for major updates
- Change logs for each update
- Rollback capability for issues

**Code Versioning:**
- Git repository with tagged releases
- Automated testing before deployment
- Code review process
- Documentation updates

## Data Access

### Public Access

**Web Application:**
- Interactive maps and visualizations
- Data exploration tools
- Export capabilities (limited)
- No authentication required

**API Access:**
- RESTful API endpoints
- Rate limiting applied
- CORS enabled for web access
- JSON response format

### Future Access Control

**Planned Features:**
- User authentication system
- Tiered access levels
- Embargoed data access
- Usage analytics and monitoring

## Data Citations

### Required Citations

**Sea Level Data:**
```
Legeais, J. F., et al. (2018). An improved and homogeneous altimeter sea level record from the ESA Climate Change Initiative. Earth System Science Data, 10(1), 281-301.
```

**Hurricane Data:**
```
Knapp, K. R., et al. (2010). The International Best Track Archive for Climate Stewardship (IBTrACS). Bulletin of the American Meteorological Society, 91(3), 363-376.
```

**Coastal DEM:**
```
Kulp, S. A., & Strauss, B. H. (2019). New elevation data triple estimates of global vulnerability to sea-level rise and coastal flooding. Nature Communications, 10(1), 1-12.
```

### Data Licenses

**Sea Level Data:** Public Domain
**Hurricane Data:** Public Domain
**DEM Data:** CC BY 4.0
**Application Code:** MIT License

## Contact Information

**Data Questions:** data@coastal-flood-viewer.example.org
**Technical Support:** support@coastal-flood-viewer.example.org
**General Inquiries:** info@coastal-flood-viewer.example.org
