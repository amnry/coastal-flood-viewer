'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';

export default function TileLayerDEM() {
  const map = useMap();
  const { activeLayers } = useAppStore();

  useEffect(() => {
    if (!activeLayers.dem) return;

    // Create DEM tile layer
    const demLayer = L.tileLayer(
      dataClient.buildTileUrl('dem', '{z}', '{x}', '{y}'),
      {
        attribution: 'Coastal DEM: Google Earth Engine',
        opacity: 0.8,
        zIndex: 1,
      }
    );

    // Add layer to map
    demLayer.addTo(map);

    return () => {
      map.removeLayer(demLayer);
    };
  }, [map, activeLayers.dem]);

  return null;
}
