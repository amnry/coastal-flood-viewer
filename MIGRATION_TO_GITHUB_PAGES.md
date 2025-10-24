# Migration from Cloudflare Pages to GitHub Pages

## Overview

This document summarizes the migration from Cloudflare Pages to GitHub Pages for the Coastal Flood Viewer application.

## Changes Made

### 1. Documentation Updates

All references to Cloudflare Pages have been replaced with GitHub Pages:

- **README.md** - Updated deployment platform to GitHub Pages
- **IMPLEMENTATION_COMPLETE.md** - Changed deployment target from Cloudflare Pages to GitHub Pages
- **GEE_INTEGRATION_SUMMARY.md** - Updated production deployment recommendations
- **SETUP_GEE.md** - Updated frontend deployment options to prioritize GitHub Pages
- **WEEKLY_PROGRESS_REPORT.md** - Updated status and deployment information
- **frontend/README.md** - Changed deployment platform and configuration details
- **docs/ARCHITECTURE.md** - Updated architecture diagrams and component descriptions
- **infra/README.md** - Revised infrastructure configuration and deployment process
- **infra/security-headers.md** - Updated security implementation details

### 2. Configuration Files

#### Updated
- **frontend/next.config.js** - Removed Cloudflare-specific comments
- **frontend/_headers** - Added note that GitHub Pages doesn't support custom headers via this file
- **frontend/_redirects** - Added note that GitHub Pages doesn't support this file format

#### Deprecated
- **infra/cloudflare_worker.js** - Marked as deprecated with reference to Flask backend

### 3. Architecture Changes

#### Before (Cloudflare Pages)
```
User → Next.js App → Cloudflare CDN → GCS Bucket
  ↓
User → Next.js App → Cloudflare Worker → Google Earth Engine
```

#### After (GitHub Pages)
```
User → Next.js App → GitHub Pages CDN → GCS Bucket
  ↓
User → Next.js App → Backend API (Flask) → Google Earth Engine
```

### 4. Key Differences

| Aspect | Cloudflare Pages | GitHub Pages |
|--------|------------------|--------------|
| **Hosting** | Cloudflare's edge network | GitHub's CDN |
| **Deployment** | Auto from GitHub | GitHub Actions workflow |
| **Custom Headers** | Supported via _headers | Not supported (use backend) |
| **Redirects** | Supported via _redirects | Limited support |
| **API Layer** | Cloudflare Workers | Flask Backend API |
| **Cost** | Free tier: 500 builds/month | Free for public repos |
| **SSL/TLS** | Automatic | Automatic |

### 5. Deployment Configuration

The application uses GitHub Actions for automated deployment:

**Primary Workflow:** `.github/workflows/deploy.yml`
- Builds Next.js application
- Deploys to GitHub Pages
- Runs on every push to main branch

**Alternative Workflow:** `.github/workflows/nextjs.yml`
- GitHub's template workflow
- Also deploys to GitHub Pages
- Can be used as backup

### 6. No Longer Used

The following Cloudflare-specific features are no longer in use:

- Cloudflare Workers for API proxy (replaced by Flask backend)
- Cloudflare Pages edge caching (replaced by GitHub Pages CDN)
- Cloudflare security features (replaced by GitHub + backend security)
- Custom _headers file for security headers (should be configured in backend)
- Custom _redirects file for URL rewrites (not needed with GitHub Pages)

### 7. Backend API

The application now relies entirely on the Flask backend API for:

- Google Earth Engine data access
- Security headers configuration
- CORS configuration
- Rate limiting
- Data processing

**Backend Location:** `backend/app.py`

**Deployment Options:**
- Google Cloud Run (recommended)
- Heroku
- AWS Lambda (with modifications)

## Migration Checklist

✅ Updated all documentation files
✅ Removed Cloudflare references from code
✅ Updated architecture diagrams
✅ Marked Cloudflare Worker as deprecated
✅ Updated deployment workflows
✅ Verified GitHub Actions workflows are configured
✅ Updated security configuration documentation
✅ Added migration notes to configuration files

## Testing

To test the application with GitHub Pages:

1. **Enable GitHub Pages in repository settings**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The deploy.yml workflow will handle deployment

2. **Push to main branch**
   ```bash
   git push origin main
   ```

3. **Monitor deployment**
   - Check Actions tab for workflow status
   - Wait for deployment to complete

4. **Access the site**
   - URL: `https://username.github.io/coastal-flood-viewer/`
   - Or custom domain if configured

## Future Considerations

### Custom Domain

To use a custom domain with GitHub Pages:

1. Add CNAME file to `frontend/out/` or `frontend/public/`
2. Configure DNS records
3. Enable HTTPS in GitHub Pages settings

### Performance Optimization

- GitHub Pages CDN is globally distributed
- Static files are cached automatically
- Consider adding service worker for offline support
- Use backend API caching for data endpoints

### Security

- GitHub Pages provides automatic HTTPS
- Configure security headers in backend API
- Use CORS properly to restrict API access
- Implement rate limiting in backend

## Support

For issues or questions:

1. Check GitHub Actions logs for deployment errors
2. Verify GitHub Pages is enabled in repository settings
3. Ensure workflows have necessary permissions
4. Review backend API configuration

## Summary

The migration from Cloudflare Pages to GitHub Pages is complete. All references to Cloudflare have been removed or deprecated. The application now uses:

- **Frontend:** GitHub Pages for static hosting
- **Backend:** Flask API for Google Earth Engine integration
- **Deployment:** GitHub Actions for automated CI/CD
- **CDN:** GitHub's global content delivery network

This provides a simpler, free, and well-integrated hosting solution for the Coastal Flood Viewer application.

