# Coastal Flood Viewer Architecture

This document describes the overall architecture of the Coastal Flood Viewer system.

## System Overview

The Coastal Flood Viewer is a production-grade web application that provides interactive visualizations of coastal flood risks, sea level rise, and hurricane impacts. The system follows a modern, cloud-native architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Next.js App   │  │   Mobile Web    │  │   Desktop Web   │ │
│  │  (Primary)      │  │   (Responsive)  │  │   (Full UI)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Content Delivery Network                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Cloudflare     │  │  Global Edge    │  │  SSL/TLS        │ │
│  │  Pages          │  │  Caching        │  │  Termination    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  GCS Bucket     │  │  Cloudflare     │  │  Google Earth   │ │
│  │  (Tiles/COGs)   │  │  Worker (API)   │  │  Engine         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Processing Pipeline                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Satellite      │  │  DEM            │  │  Hurricane      │ │
│  │  Data           │  │  Processing     │  │  Data           │ │
│  │  Processing     │  │                 │  │  Processing     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Application (Next.js)

**Technology Stack:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Leaflet for interactive maps
- ECharts for data visualization
- Zustand for state management

**Key Features:**
- Server-side rendering (SSR)
- Static site generation (SSG)
- Progressive Web App (PWA) capabilities
- Responsive design
- Accessibility compliance (WCAG AA)

**Deployment:**
- Cloudflare Pages
- Automatic deployments from GitHub
- Global CDN distribution
- Automatic HTTPS

### 2. Data Storage (Google Cloud Storage)

**Bucket Structure:**
```
gs://coastal-flood-viewer-tiles/
├── tiles/
│   ├── slr/           # Sea Level Anomaly tiles
│   └── flood/         # Flood depth tiles
├── cogs/              # Cloud Optimized GeoTIFFs
│   └── dem/
├── vector/            # Vector data
│   └── ibtracs_subset.geojson
└── catalog/           # Metadata
    └── catalog.json
```

**Access Control:**
- Public read access for visualization data
- Private access for raw datasets
- CORS configured for web access
- Object versioning enabled

### 3. API Layer (Cloudflare Worker)

**Purpose:**
- Secure proxy to Google Earth Engine
- Signed URL generation for private data
- Rate limiting and caching
- CORS handling

**Endpoints:**
- `/api/elevation` - Get elevation data
- `/api/sea-level` - Get sea level data
- `/api/signed-url` - Generate signed URLs

**Security:**
- No credentials exposed to browser
- Server-side authentication
- Request validation
- Error handling

### 4. Data Processing Pipeline

**Components:**
- `sa_data.py` - Satellite altimetry processing
- `dem_processing.py` - DEM processing
- `hurricane_data.py` - Hurricane data processing

**Processing Flow:**
1. Raw data ingestion
2. Data validation and cleaning
3. Geospatial processing
4. Tile generation
5. Upload to GCS
6. CDN distribution

## Data Flow

### 1. User Interaction Flow

```
User → Next.js App → Cloudflare CDN → GCS Bucket
  ↓
User → Next.js App → Cloudflare Worker → Google Earth Engine
```

### 2. Data Processing Flow

```
Raw Data → Python Scripts → Processed Data → GCS Bucket → CDN → User
```

### 3. Static Asset Flow

```
Next.js Build → Cloudflare Pages → Global CDN → User
```

## Security Architecture

### 1. Data Security

- **Raw datasets remain private** (not in public bucket)
- **Only derived visualization assets are public**
- **No sensitive data in frontend code**
- **Server-side data processing only**

### 2. Network Security

- **HTTPS everywhere** (TLS 1.3)
- **CSP headers** for XSS protection
- **CORS properly configured**
- **Rate limiting** on API endpoints

### 3. Infrastructure Security

- **Cloudflare security features** (DDoS protection, WAF)
- **GCS bucket security** (IAM, encryption)
- **No exposed credentials**
- **Regular security updates**

## Scalability Considerations

### 1. Frontend Scalability

- **Static site generation** for fast loading
- **CDN distribution** for global performance
- **Code splitting** for optimal bundle sizes
- **Caching strategies** for data assets

### 2. Data Scalability

- **Tile-based architecture** for efficient data transfer
- **Cloud Optimized GeoTIFFs** for large datasets
- **Progressive loading** for better UX
- **Compression** for reduced bandwidth

### 3. API Scalability

- **Cloudflare Workers** for global edge computing
- **Caching** for frequently requested data
- **Rate limiting** for fair usage
- **Error handling** for resilience

## Monitoring and Observability

### 1. Application Monitoring

- **Cloudflare Analytics** for usage metrics
- **Core Web Vitals** for performance
- **Error tracking** for debugging
- **User experience monitoring**

### 2. Infrastructure Monitoring

- **GCS access logs** for data usage
- **Cloudflare logs** for security events
- **Worker performance** metrics
- **CDN hit rates** and caching

### 3. Data Quality Monitoring

- **Data validation** in processing pipeline
- **Automated testing** for data integrity
- **Version control** for data products
- **Backup and recovery** procedures

## Future Enhancements

### 1. Planned Features

- **User authentication** for embargoed data
- **Real-time data updates** via WebSockets
- **Mobile application** (React Native)
- **API expansion** for more data endpoints

### 2. Technical Improvements

- **Database integration** for user data
- **Advanced caching** strategies
- **Machine learning** for data insights
- **Performance optimization** for large datasets

### 3. Scalability Improvements

- **Multi-region deployment**
- **Advanced CDN features**
- **Database clustering**
- **Microservices architecture**

## Development Workflow

### 1. Code Development

- **GitHub repository** with main branch protection
- **Pull request reviews** for code quality
- **Automated testing** in CI/CD pipeline
- **Code formatting** and linting

### 2. Data Processing

- **Versioned data products** in GCS
- **Automated processing** pipelines
- **Data validation** and testing
- **Quality assurance** procedures

### 3. Deployment

- **Automatic frontend deployment** via Cloudflare Pages
- **Manual data deployment** via GCS upload
- **Environment separation** (dev/staging/prod)
- **Rollback procedures** for issues

This architecture provides a robust, scalable, and secure foundation for the Coastal Flood Viewer while maintaining simplicity and maintainability.
