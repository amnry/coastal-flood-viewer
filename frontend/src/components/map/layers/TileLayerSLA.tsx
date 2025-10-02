'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';

export default function TileLayerSLA() {
  const map = useMap();
  const { selectedYear, selectedMonth, activeLayers } = useAppStore();

  useEffect(() => {
    if (!activeLayers.sla) return;

    // Create SLA tile layer
    const slaLayer = L.tileLayer(
      dataClient.buildTileUrl('slr', '{z}', '{x}', '{y}'),
      {
        attribution: 'Sea Level Anomaly Data: NOAA/NASA',
        opacity: 0.7,
        zIndex: 1,
      }
    );

    // Add layer to map
    slaLayer.addTo(map);

    return () => {
      map.removeLayer(slaLayer);
    };
  }, [map, selectedYear, selectedMonth, activeLayers.sla]);

  return null;
}
