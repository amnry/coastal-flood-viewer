import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Leaflet
vi.mock('leaflet', () => ({
  map: vi.fn(() => ({
    setView: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
  tileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  polyline: vi.fn(() => ({
    addTo: vi.fn(),
    on: vi.fn(),
    bindPopup: vi.fn(),
  })),
  latLng: vi.fn(),
  latLngBounds: vi.fn(),
  icon: vi.fn(),
  marker: vi.fn(() => ({
    addTo: vi.fn(),
    setLatLng: vi.fn(),
  })),
}));

// Mock ECharts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_TILES_BASE_URL = 'https://storage.googleapis.com/coastal-flood-viewer-tiles';
process.env.NEXT_PUBLIC_DATA_CATALOG_URL = 'https://storage.googleapis.com/coastal-flood-viewer-tiles/catalog/catalog.json';
process.env.NEXT_PUBLIC_ELEVATION_ASSET = 'users/amanaryya1/coastal-dem-files';
process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
