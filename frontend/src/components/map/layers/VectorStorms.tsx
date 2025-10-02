'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';
import { StormCollection } from '@/types/storm';

export default function VectorStorms() {
  const map = useMap();
  const { activeLayers, stormFilters, setSelectedStorm } = useAppStore();
  const [stormData, setStormData] = useState<StormCollection | null>(null);

  useEffect(() => {
    const loadStormData = async () => {
      try {
        const data = await dataClient.getHurricaneData();
        setStormData(data);
      } catch (error) {
        console.error('Failed to load storm data:', error);
      }
    };

    loadStormData();
  }, []);

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
      
      // Create polyline for storm track
      const polyline = L.polyline(coordinates, {
        color: getStormColor(storm.properties.category[0] || 'TS'),
        weight: 3,
        opacity: 0.8,
      });

      // Add click handler
      polyline.on('click', () => {
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

      // Add popup
      polyline.bindPopup(`
        <div>
          <h3 class="font-bold">${storm.properties.name} (${storm.properties.year})</h3>
          <p>Max Category: ${storm.properties.category[0] || 'TS'}</p>
          <p>Max Wind Speed: ${Math.max(...storm.properties.wind_speed)} mph</p>
          <p>Track Length: ${storm.properties.track_length.toFixed(1)} km</p>
        </div>
      `);

      stormLayers.push(polyline);
    });

    // Add all layers to map
    stormLayers.forEach(layer => map.addLayer(layer));

    return () => {
      stormLayers.forEach(layer => map.removeLayer(layer));
    };
  }, [map, activeLayers.storms, stormData, stormFilters, setSelectedStorm]);

  return null;
}

function getStormColor(category: string): string {
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
