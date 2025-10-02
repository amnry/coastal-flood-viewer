'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';

export default function TileLayerFlood() {
  const map = useMap();
  const { scenarioMeters, activeLayers } = useAppStore();

  useEffect(() => {
    if (!activeLayers.flood) return;

    // Create flood depth tile layer
    const floodLayer = L.tileLayer(
      dataClient.buildTileUrl('flood', '{z}', '{x}', '{y}'),
      {
        attribution: 'Flood Depth Data: Coastal Flood Viewer',
        opacity: 0.6,
        zIndex: 2,
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
