# Infrastructure Configuration

This directory contains infrastructure configuration and deployment scripts for the Coastal Flood Viewer.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │────│  Cloudflare CDN │────│  GCS Bucket     │
│  (Cloudflare    │    │                 │    │  (Tiles/COGs)   │
│   Pages)        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  GitHub Actions │    │ Cloudflare      │    │  Google Earth   │
│  (CI/CD)        │    │ Worker (API)    │    │  Engine         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components

### 1. Frontend Deployment (Cloudflare Pages)

- **Platform:** Cloudflare Pages
- **Build:** Next.js static export
- **Domain:** `coastal-flood-viewer.example.org`
- **CDN:** Global edge caching
- **SSL:** Automatic HTTPS

### 2. Data Storage (Google Cloud Storage)

- **Bucket:** `coastal-flood-viewer-tiles`
- **Access:** Public read for tiles/COGs
- **Versioning:** Enabled for data integrity
- **CDN:** Cloudflare integration

### 3. API Layer (Cloudflare Worker)

- **Purpose:** Proxy to GEE and signed URL service
- **Runtime:** V8 JavaScript
- **Location:** Global edge deployment
- **Security:** No GEE credentials in browser

### 4. Data Processing (Google Earth Engine)

- **Asset:** `users/amanaryya1/coastal-dem-files`
- **Access:** Via Cloudflare Worker
- **Processing:** Server-side only

## Deployment Process

### Frontend Deployment

1. **Build:** Next.js app builds to static files
2. **Deploy:** Cloudflare Pages automatically deploys on git push
3. **CDN:** Files distributed to global edge locations
4. **SSL:** Automatic HTTPS certificate provisioning

### Data Pipeline Deployment

1. **Process:** Python scripts run on GCP Compute Engine
2. **Upload:** Processed data uploaded to GCS bucket
3. **CDN:** Cloudflare CDN caches data globally
4. **Update:** Frontend automatically uses new data

## Security Configuration

### Cloudflare Security Headers

See `security-headers.md` for detailed security configuration.

### GCS Bucket Security

- **IAM:** Public read access for tiles/COGs only
- **CORS:** Configured for web access
- **Encryption:** At rest and in transit

### API Security

- **Authentication:** No user auth required (public data)
- **Rate Limiting:** Cloudflare rate limiting
- **CORS:** Configured for frontend domain

## Monitoring and Logging

### Cloudflare Analytics

- **Page views:** Tracked via Plausible integration
- **Performance:** Core Web Vitals monitoring
- **Errors:** Automatic error tracking

### GCS Monitoring

- **Access logs:** Cloud Logging integration
- **Storage:** Usage and cost monitoring
- **Performance:** CDN hit rates

## Cost Optimization

### Cloudflare Pages

- **Free tier:** 500 builds/month, 20,000 requests/month
- **Pro tier:** $20/month for higher limits

### GCS Storage

- **Standard storage:** For frequently accessed tiles
- **Nearline storage:** For archived data
- **CDN:** Reduces egress costs

### Compute Engine

- **Preemptible instances:** For data processing
- **Auto-scaling:** Scale down when not processing

## Disaster Recovery

### Data Backup

- **GCS versioning:** All data versions retained
- **Cross-region replication:** Critical data replicated
- **Git repository:** Code and configuration backed up

### Service Recovery

- **Cloudflare:** 99.99% uptime SLA
- **GCS:** 99.9% availability SLA
- **Multiple regions:** Redundancy across regions

## Future Enhancements

### Planned Features

- **Authentication:** User accounts for embargoed data
- **API expansion:** More data endpoints
- **Real-time updates:** WebSocket for live data
- **Mobile app:** React Native version

### Scalability

- **CDN expansion:** Additional edge locations
- **Database:** PostgreSQL for user data
- **Caching:** Redis for API responses
- **Load balancing:** Multiple worker instances
