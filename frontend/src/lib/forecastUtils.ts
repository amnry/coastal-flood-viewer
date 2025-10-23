import { StormFeature } from '@/types/storm';

export interface ForecastPoint {
  lat: number;
  lon: number;
  windSpeed: number;
  category: string;
  pressure: number;
  radius: number; // Forecast uncertainty radius in km
}

export interface WindProbabilityZone {
  coordinates: [number, number][];
  probability: number;
  color: string;
}

// Generate forecast cone with probability zones
export function generateForecastCone(storm: StormFeature): WindProbabilityZone[] {
  const coordinates = storm.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]);
  const windSpeeds = storm.properties.wind_speed;
  const categories = storm.properties.category;
  
  // Create forecast points with increasing uncertainty radius
  const forecastPoints: ForecastPoint[] = coordinates.map((coord, index) => {
    // Base radius increases with distance from start
    const baseRadius = Math.max(50, index * 25); // Minimum 50km, increases by 25km per point
    const windSpeed = windSpeeds[index] || 0;
    
    return {
      lat: coord[0],
      lon: coord[1],
      windSpeed,
      category: categories[index] || 'TS',
      pressure: storm.properties.pressure[index] || 1013,
      radius: baseRadius + (windSpeed / 2), // Larger storms have larger uncertainty
    };
  });

  // Generate probability zones
  const zones: WindProbabilityZone[] = [];
  
  // Create concentric zones around each forecast point
  for (let i = 0; i < forecastPoints.length; i++) {
    const point = forecastPoints[i];
    
    // Create multiple probability levels
    const probabilityLevels = [
      { probability: 90, radiusMultiplier: 0.3, color: '#800080' }, // Purple - 90%
      { probability: 70, radiusMultiplier: 0.5, color: '#FF0000' }, // Red - 70%
      { probability: 50, radiusMultiplier: 0.7, color: '#FF8000' }, // Orange - 50%
      { probability: 30, radiusMultiplier: 0.9, color: '#FFFF00' }, // Yellow - 30%
      { probability: 10, radiusMultiplier: 1.2, color: '#00FF00' }, // Green - 10%
    ];

    probabilityLevels.forEach(({ probability, radiusMultiplier, color }) => {
      const radius = point.radius * radiusMultiplier;
      const circle = createCircle(point.lat, point.lon, radius);
      
      zones.push({
        coordinates: circle,
        probability,
        color,
      });
    });
  }

  return zones;
}

// Create a circle polygon for a given center and radius
function createCircle(lat: number, lon: number, radiusKm: number): [number, number][] {
  const earthRadius = 6371; // Earth's radius in km
  const points = 32; // Number of points to create smooth circle
  
  const coordinates: [number, number][] = [];
  
  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const angleRad = (angle * Math.PI) / 180;
    
    const deltaLat = (radiusKm / earthRadius) * Math.cos(angleRad);
    const deltaLon = (radiusKm / earthRadius) * Math.sin(angleRad) / Math.cos(lat * Math.PI / 180);
    
    const newLat = lat + deltaLat * (180 / Math.PI);
    const newLon = lon + deltaLon * (180 / Math.PI);
    
    coordinates.push([newLat, newLon]);
  }
  
  return coordinates;
}

// Get storm intensity symbol
export function getStormSymbol(category: string, windSpeed: number): string {
  if (windSpeed >= 64) {
    return '🌀'; // Hurricane symbol
  } else if (windSpeed >= 34) {
    return '🌪️'; // Tropical storm symbol
  } else {
    return '⭕'; // Depression symbol
  }
}

// Get probability color based on percentage
export function getProbabilityColor(probability: number): string {
  if (probability >= 90) return '#800080'; // Purple
  if (probability >= 70) return '#FF0000'; // Red
  if (probability >= 50) return '#FF8000'; // Orange
  if (probability >= 30) return '#FFFF00'; // Yellow
  if (probability >= 10) return '#00FF00'; // Green
  return '#008000'; // Dark green for <10%
}




