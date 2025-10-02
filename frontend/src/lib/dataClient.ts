import { Catalog } from '@/types/catalog';
import { TimeSeries } from '@/types/analytics';
import { StormCollection } from '@/types/storm';

const TILES_BASE_URL = process.env.NEXT_PUBLIC_TILES_BASE_URL || '';
const CATALOG_URL = process.env.NEXT_PUBLIC_DATA_CATALOG_URL || '';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

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
  
  buildTileUrl(layer: string, z: string, x: string, y: string): string {
    if (USE_MOCK_DATA) {
      return `/mock/tiles/${layer}/${z}/${x}/${y}.png`;
    }
    
    return `${TILES_BASE_URL}/tiles/${layer}/${z}/${x}/${y}.png`;
  }
  
  buildCOGUrl(layer: string, filename: string): string {
    if (USE_MOCK_DATA) {
      return `/mock/cogs/${layer}/${filename}`;
    }
    
    return `${TILES_BASE_URL}/cogs/${layer}/${filename}`;
  }
}

export const dataClient = DataClient.getInstance();
