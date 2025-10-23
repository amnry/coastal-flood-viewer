import { Catalog } from '@/types/catalog';
import { TimeSeries } from '@/types/analytics';
import { StormCollection } from '@/types/storm';

const TILES_BASE_URL = process.env.NEXT_PUBLIC_TILES_BASE_URL || '';
const CATALOG_URL = process.env.NEXT_PUBLIC_DATA_CATALOG_URL || '';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001';

export class DataClient {
  private static instance: DataClient;
  
  private constructor() {}
  
  static getInstance(): DataClient {
    if (!DataClient.instance) {
      DataClient.instance = new DataClient();
    }
    return DataClient.instance;
  }
  
  async getCatalog(): Promise<Catalog> {
    if (USE_MOCK_DATA) {
      const response = await fetch('/mock/catalog.json');
      return response.json();
    }
    
    const response = await fetch(CATALOG_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.statusText}`);
    }
    return response.json();
  }
  
  async getMockTimeSeries(lat: number, lon: number): Promise<TimeSeries> {
    // Generate mock time series data
    const data = [];
    const startDate = new Date('1993-01-01');
    
    for (let i = 0; i < 360; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Generate realistic sea level anomaly data with trend
      const trend = i * 0.002; // 2mm/year trend
      const seasonal = Math.sin((i * 2 * Math.PI) / 12) * 50; // Seasonal variation
      const noise = (Math.random() - 0.5) * 20; // Random noise
      const value = trend + seasonal + noise;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
      });
    }
    
    return {
      data,
      unit: 'mm',
      variable: 'Sea Level Anomaly',
      location: { lat, lon },
    };
  }
  
  async getHurricaneData(): Promise<StormCollection> {
    if (USE_MOCK_DATA) {
      const response = await fetch('/mock/hurricanes_subset.geojson');
      return response.json();
    }
    
    // In production, this would fetch from CDN
    const response = await fetch(`${TILES_BASE_URL}/vector/ibtracs_subset.geojson`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hurricane data: ${response.statusText}`);
    }
    return response.json();
  }
  
  buildTileUrl(layer: string, z: string, x: string, y: string, params?: Record<string, string | number>): string {
    if (USE_MOCK_DATA) {
      return `/mock/tiles/${layer}/${z}/${x}/${y}.png`;
    }
    
    // Use backend API for dynamic tile generation
    let url = `${BACKEND_API_URL}/api/${layer}-tiles/${z}/${x}/${y}.png`;
    
    // Add query parameters for dynamic layers
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      url += `?${queryParams.toString()}`;
    }
    
    return url;
  }
  
  buildCOGUrl(layer: string, filename: string): string {
    if (USE_MOCK_DATA) {
      return `/mock/cogs/${layer}/${filename}`;
    }
    
    return `${TILES_BASE_URL}/cogs/${layer}/${filename}`;
  }

  async reverseGeocode(lat: number, lon: number): Promise<{ formatted: string; city?: string; state?: string; country?: string }> {
    // Always use real geocoding for address data, even in mock mode
    // This ensures users see actual location information

    // First try with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // Use OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CoastalFloodViewer/1.0'
          },
          signal: controller.signal,
          mode: 'cors'
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const address = data.address || {};
      
      return {
        formatted: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        city: address.city || address.town || address.village || address.hamlet,
        state: address.state,
        country: address.country
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Log the error for debugging but don't expose sensitive details
      console.warn('Reverse geocoding failed, using coordinates:', error instanceof Error ? error.message : 'Unknown error');
      
      // Return a more user-friendly fallback
      return this.getFallbackLocation(lat, lon);
    }
  }

  private getFallbackLocation(lat: number, lon: number): { formatted: string; city?: string; state?: string; country?: string } {
    // Provide a more descriptive fallback based on coordinates
    const latStr = lat.toFixed(4);
    const lonStr = lon.toFixed(4);
    
    // Basic geographic region detection
    let region = 'Unknown Region';
    let country = 'Unknown';
    
    if (lat >= 24 && lat <= 49 && lon >= -125 && lon <= -66) {
      region = 'North America';
      country = 'United States';
    } else if (lat >= 25 && lat <= 71 && lon >= -173 && lon <= -52) {
      region = 'North America';
      country = 'Canada';
    } else if (lat >= 18 && lat <= 32 && lon >= -118 && lon <= -86) {
      region = 'North America';
      country = 'Mexico';
    }
    
    return {
      formatted: `${latStr}, ${lonStr}`,
      city: region,
      state: region,
      country: country
    };
  }

  async getPointAnalytics(lat: number, lon: number, year?: string, month?: string): Promise<{
    elevation: number | null;
    seaLevel: number | null;
    timeSeries: TimeSeries;
    stats: {
      mean: number;
      median: number;
      min: number;
      max: number;
      trend: number;
      recentChange: number;
    };
  }> {
    if (USE_MOCK_DATA) {
      // Return mock data
      const timeSeries = await this.getMockTimeSeries(lat, lon);
      const values = timeSeries.data.map(d => d.value);
      const sortedValues = [...values].sort((a, b) => a - b);
      
      return {
        elevation: Math.random() * 10,
        seaLevel: Math.random() * 100 - 50,
        timeSeries,
        stats: {
          mean: values.reduce((sum, v) => sum + v, 0) / values.length,
          median: sortedValues[Math.floor(sortedValues.length / 2)],
          min: Math.min(...values),
          max: Math.max(...values),
          trend: 2.1,
          recentChange: 8.5,
        },
      };
    }

    // Call the backend API
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
    });
    
    if (year) params.append('year', year);
    if (month) params.append('month', month);

    const response = await fetch(`${BACKEND_API_URL}/api/point-analytics?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch point analytics: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      elevation: data.elevation,
      seaLevel: data.seaLevel,
      timeSeries: data.timeSeries,
      stats: data.stats,
    };
  }

  async getElevation(lat: number, lon: number, scale?: number): Promise<number | null> {
    if (USE_MOCK_DATA) {
      return Math.random() * 10;
    }

    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
    });
    
    if (scale) params.append('scale', scale.toString());

    const response = await fetch(`${BACKEND_API_URL}/api/elevation?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch elevation: ${response.statusText}`);
    }

    const data = await response.json();
    return data.elevation;
  }

  async getSeaLevel(lat: number, lon: number, year?: string, month?: string): Promise<number | null> {
    if (USE_MOCK_DATA) {
      return Math.random() * 100 - 50;
    }

    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
    });
    
    if (year) params.append('year', year);
    if (month) params.append('month', month);

    const response = await fetch(`${BACKEND_API_URL}/api/sea-level?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sea level: ${response.statusText}`);
    }

    const data = await response.json();
    return data.seaLevel;
  }

  async getTimeSeries(lat: number, lon: number, month?: string): Promise<TimeSeries> {
    if (USE_MOCK_DATA) {
      return this.getMockTimeSeries(lat, lon);
    }

    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
    });
    
    if (month) params.append('month', month);

    const response = await fetch(`${BACKEND_API_URL}/api/timeseries?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch time series: ${response.statusText}`);
    }

    return response.json();
  }
}

export const dataClient = DataClient.getInstance();
