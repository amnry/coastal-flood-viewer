'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/store/useAppStore';
import { dataClient } from '@/lib/dataClient';
import SelectedLocationMarker from './SelectedLocationMarker';

interface InteractiveMapProps {
  children?: React.ReactNode;
  center?: LatLngTuple;
  zoom?: number;
  className?: string;
}

const MapEventHandler = () => {
  const map = useMap();
  const { setClickedPoint, getMockTimeSeries } = useAppStore();

  useEffect(() => {
    const handleClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      try {
        // Generate mock elevation (simplified)
        const elevation = Math.random() * 10; // 0-10m elevation
        
        // Generate mock sea level
        const seaLevel = Math.random() * 100 - 50; // -50 to +50mm
        
        // Get mock time series
        const timeSeries = await getMockTimeSeries(lat, lng);
        
        // Get address information with error handling
        let address;
        try {
          address = await dataClient.reverseGeocode(lat, lng);
        } catch (geocodeError) {
          console.warn('Geocoding failed, using fallback:', geocodeError);
          // Use fallback address information
          address = {
            formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            city: 'Unknown Location',
            state: 'Unknown Region',
            country: 'Unknown Country'
          };
        }
        
        setClickedPoint({
          lat,
          lon: lng,
          elevation,
          seaLevel,
          timeSeries,
          address,
          stats: {
            mean: timeSeries.data.reduce((sum, point) => sum + point.value, 0) / timeSeries.data.length,
            median: timeSeries.data.sort((a, b) => a.value - b.value)[Math.floor(timeSeries.data.length / 2)].value,
            min: Math.min(...timeSeries.data.map(p => p.value)),
            max: Math.max(...timeSeries.data.map(p => p.value)),
            trend: 2.1, // mm/year
            recentChange: 8.5, // mm over last 5 years
          },
        });
      } catch (error) {
        console.error('Error processing map click:', error);
        // Still set basic point data even if other operations fail
        setClickedPoint({
          lat,
          lon: lng,
          elevation: 0,
          seaLevel: 0,
          timeSeries: { data: [], unit: 'mm', variable: 'Sea Level Anomaly', location: { lat, lon: lng } },
          address: {
            formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            city: 'Error Loading Data',
            state: 'Please try again',
            country: 'Unknown'
          },
          stats: {
            mean: 0,
            median: 0,
            min: 0,
            max: 0,
            trend: 0,
            recentChange: 0,
          },
        });
      }
    };

    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, setClickedPoint, getMockTimeSeries]);

  return null;
};

export default function InteractiveMap({ 
  children, 
  center = [40.7128, -74.0060], 
  zoom = 8,
  className = "h-full w-full"
}: InteractiveMapProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <MapEventHandler />
        <SelectedLocationMarker />
        {children}
      </MapContainer>
    </div>
  );
}
