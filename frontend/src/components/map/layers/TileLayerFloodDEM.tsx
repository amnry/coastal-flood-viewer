'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';

export default function TileLayerFloodDEM() {
  const map = useMap();
  const { scenarioMeters, activeLayers } = useAppStore();

  useEffect(() => {
    if (!activeLayers.flood) return;

    // Create flood visualization layer based on DEM and sea level rise
    // This layer shows areas that would be flooded given the current scenario
    const floodLayer = L.tileLayer(
      dataClient.buildTileUrl('flood-dem', '{z}', '{x}', '{y}', { slr: scenarioMeters }),
      {
        attribution: 'Flood Visualization: Coastal DEM + Sea Level Rise',
        opacity: 0.7,
        zIndex: 3,
      }
    );

    // Add layer to map
    floodLayer.addTo(map);

    return () => {
      map.removeLayer(floodLayer);
    };
  }, [map, scenarioMeters, activeLayers.flood]);

  return null;
}
