# Coastal Flood Viewer Frontend

A production-ready Next.js application for visualizing coastal flood risks, sea level rise, and hurricane impacts.

## Features

- **Sea Level Explorer** - Interactive visualization of sea level anomalies over time
- **Coastal Elevation & Flood Mapper** - DEM visualization with flood depth overlays
- **Hurricane Impact Simulator** - Storm track visualization with impact zones
- **Data Catalog** - Metadata browser for available datasets
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Accessibility** - WCAG AA compliant
- **SEO Optimized** - Search engine friendly with sitemap generation

## Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet with React Leaflet
- **Charts:** ECharts
- **State Management:** Zustand
- **Validation:** Zod
- **Testing:** Vitest + Playwright
- **Deployment:** Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Public environment variables for the frontend
# These are exposed to the browser and should not contain secrets

# Base URL for tile services (CDN)
NEXT_PUBLIC_TILES_BASE_URL=https://storage.googleapis.com/coastal-flood-viewer-tiles

# Data catalog URL
NEXT_PUBLIC_DATA_CATALOG_URL=https://storage.googleapis.com/coastal-flood-viewer-tiles/catalog/catalog.json

# Google Earth Engine elevation asset
NEXT_PUBLIC_ELEVATION_ASSET=users/amanaryya1/coastal-dem-files

# For development, use mock data
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run e2e tests with UI
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── explorer/          # Sea Level Explorer
│   ├── flood-mapper/      # Flood Mapper
│   ├── hurricane-impact/  # Hurricane Impact Simulator
│   ├── catalog/           # Data Catalog
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── map/              # Map-related components
│   ├── panels/           # Sidebar panels
│   ├── controls/         # Control components
│   └── Navigation.tsx    # Main navigation
├── lib/                  # Utility libraries
│   └── dataClient.ts     # Data fetching client
├── store/                # State management
│   └── useAppStore.ts    # Zustand store
├── types/                # TypeScript type definitions
│   ├── catalog.ts        # Data catalog types
│   ├── storm.ts          # Hurricane data types
│   └── analytics.ts      # Analytics types
└── test/                 # Test utilities
    └── setup.ts          # Test setup
```

## Key Components

### InteractiveMap

The main map component that provides:
- Leaflet map integration
- Click event handling
- Layer management
- Responsive design

### Data Client

Centralized data fetching with:
- Mock data for development
- Production API integration
- Error handling
- Type safety

### State Management

Zustand store for:
- Time controls (year/month selection)
- Scenario controls (SLR scenarios)
- Layer visibility
- Map interactions
- UI state

## Testing

### Unit Tests

Unit tests are written with Vitest and React Testing Library:

```bash
npm run test
```

### End-to-End Tests

E2E tests are written with Playwright:

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

## Deployment

### Cloudflare Pages

The application is deployed to Cloudflare Pages with:

- Automatic deployments from GitHub
- Global CDN distribution
- Automatic HTTPS
- Edge caching

### Build Configuration

The application is configured for static export:

- `output: 'export'` in next.config.js
- Static file generation
- CDN-friendly asset paths

## Performance

### Core Web Vitals

The application is optimized for:

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Features

- Static site generation
- Image optimization
- Code splitting
- Lazy loading
- CDN caching

## Accessibility

### WCAG AA Compliance

The application follows WCAG AA guidelines:

- Keyboard navigation
- Screen reader support
- High contrast support
- Focus management
- ARIA labels

### Testing

Accessibility is tested with:

- axe-core integration
- Manual testing
- Screen reader testing
- Keyboard-only navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.