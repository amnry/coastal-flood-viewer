'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';
import { StormCollection } from '@/types/storm';
import { extractUniqueStormNames, extractUniqueYears } from '@/lib/stormUtils';
import { 
  generateForecastCone, 
  getStormSymbol
  // getProbabilityColor,
  // WindProbabilityZone 
} from '@/lib/forecastUtils';

export default function EnhancedStormVisualization() {
  const map = useMap();
  const { 
    activeLayers, 
    stormFilters, 
    setSelectedStorm,
    setAvailableStormNames,
    setAvailableYears 
  } = useAppStore();
  const [stormData, setStormData] = useState<StormCollection | null>(null);

  useEffect(() => {
    const loadStormData = async () => {
      try {
        const data = await dataClient.getHurricaneData();
        setStormData(data);
        
        // Extract and store available names and years
        const names = extractUniqueStormNames(data);
        const years = extractUniqueYears(data);
        setAvailableStormNames(names);
        setAvailableYears(years);
      } catch (error) {
        console.error('Failed to load storm data:', error);
      }
    };

    loadStormData();
  }, [setAvailableStormNames, setAvailableYears]);

  useEffect(() => {
    if (!activeLayers.storms || !stormData) return;

    // Filter storms based on current filters
    const filteredStorms = stormData.features.filter(storm => {
      if (stormFilters.year && storm.properties.year !== stormFilters.year) return false;
      if (stormFilters.name && !storm.properties.name.toLowerCase().includes(stormFilters.name.toLowerCase())) return false;
      if (stormFilters.basin && storm.properties.basin !== stormFilters.basin) return false;
      return true;
    });

    // Create storm layers
    const stormLayers: L.Layer[] = [];

    filteredStorms.forEach(storm => {
      const coordinates = storm.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]);
      
      // Generate forecast cone with probability zones
      const forecastZones = generateForecastCone(storm);
      
      // Create probability zone polygons
      forecastZones.forEach((zone) => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          weight: 1,
          opacity: 0.3,
          fillColor: zone.color,
          fillOpacity: 0.15,
          className: 'forecast-zone'
        });

        // Add tooltip with probability info
        polygon.bindTooltip(`
          <div class="text-center">
            <div class="font-bold text-sm">Wind Probability</div>
            <div class="text-lg font-bold" style="color: ${zone.color}">${zone.probability}%</div>
            <div class="text-xs">Chance of sustained<br/>34+ knot winds</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -10],
          opacity: 0.9,
          className: 'custom-tooltip'
        });

        stormLayers.push(polygon);
      });

      // Create main storm track line
      const trackLine = L.polyline(coordinates, {
        color: getTrackColor(storm.properties.category[0] || 'TS'),
        weight: 4,
        opacity: 0.9,
        className: 'storm-track'
      });

      // Add storm symbols at key points
      coordinates.forEach((coord, index) => {
        const windSpeed = storm.properties.wind_speed[index] || 0;
        const category = storm.properties.category[index] || 'TS';
        
        if (windSpeed > 0) {
          const symbol = getStormSymbol(category, windSpeed);
          
          const marker = L.marker([coord[0], coord[1]], {
            icon: L.divIcon({
              html: `
                <div class="storm-symbol" style="
                  font-size: 20px;
                  text-align: center;
                  line-height: 1;
                  background: rgba(255, 255, 255, 0.8);
                  border-radius: 50%;
                  width: 30px;
                  height: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid ${getTrackColor(category)};
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  ${symbol}
                </div>
              `,
              className: 'storm-symbol-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          });

          // Add popup for storm symbols
          marker.bindPopup(`
            <div class="storm-popup">
              <h3 class="font-bold text-lg">${storm.properties.name}</h3>
              <div class="mt-2 space-y-1">
                <p><strong>Position:</strong> Point ${index + 1}</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} mph</p>
                <p><strong>Category:</strong> ${getCategoryLabel(category)}</p>
                <p><strong>Pressure:</strong> ${storm.properties.pressure[index] || 'N/A'} mb</p>
              </div>
            </div>
          `);

          stormLayers.push(marker);
        }
      });

      // Add click handler to track line
      trackLine.on('click', () => {
        setSelectedStorm({
          id: storm.properties.sids[0],
          name: storm.properties.name,
          year: storm.properties.year,
          basin: storm.properties.basin,
          maxCategory: storm.properties.category[0] || 'TS',
          maxWindSpeed: Math.max(...storm.properties.wind_speed),
          trackLength: storm.properties.track_length,
          landfall: storm.properties.landfall,
        });
      });

      // Add popup to track line
      trackLine.bindPopup(`
        <div class="storm-track-popup">
          <h3 class="font-bold text-lg">${storm.properties.name} (${storm.properties.year})</h3>
          <div class="mt-2 space-y-1">
            <p><strong>Max Category:</strong> ${getCategoryLabel(storm.properties.category[0] || 'TS')}</p>
            <p><strong>Max Wind Speed:</strong> ${Math.max(...storm.properties.wind_speed)} mph</p>
            <p><strong>Track Length:</strong> ${storm.properties.track_length.toFixed(1)} km</p>
            <p><strong>Basin:</strong> ${getBasinLabel(storm.properties.basin)}</p>
            <p><strong>Landfall:</strong> ${storm.properties.landfall ? 'Yes' : 'No'}</p>
          </div>
          <div class="mt-3 text-xs text-gray-600">
            Click on individual storm symbols for detailed position information.
          </div>
        </div>
      `);

      stormLayers.push(trackLine);
    });

    // Add all layers to map
    stormLayers.forEach(layer => map.addLayer(layer));

    return () => {
      stormLayers.forEach(layer => map.removeLayer(layer));
    };
  }, [map, activeLayers.storms, stormData, stormFilters, setSelectedStorm]);

  return null;
}

function getTrackColor(category: string): string {
  switch (category) {
    case 'TS': return '#00ff00'; // Green for tropical storm
    case '1': return '#ffff00'; // Yellow for category 1
    case '2': return '#ff8000'; // Orange for category 2
    case '3': return '#ff0000'; // Red for category 3
    case '4': return '#ff0080'; // Magenta for category 4
    case '5': return '#8000ff'; // Purple for category 5
    default: return '#00ff00';
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'TS': return 'Tropical Storm';
    case '1': return 'Category 1';
    case '2': return 'Category 2';
    case '3': return 'Category 3';
    case '4': return 'Category 4';
    case '5': return 'Category 5';
    default: return 'Unknown';
  }
}

function getBasinLabel(basin: string): string {
  switch (basin) {
    case 'NA': return 'North Atlantic';
    case 'EP': return 'East Pacific';
    case 'WP': return 'West Pacific';
    case 'NI': return 'North Indian';
    case 'SI': return 'South Indian';
    case 'SP': return 'South Pacific';
    default: return basin;
  }
}




