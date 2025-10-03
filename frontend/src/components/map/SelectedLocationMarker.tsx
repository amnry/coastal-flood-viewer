'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';

// Create custom pin icon
const createPinIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #3B82F6;
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 12px;
          font-weight: bold;
          transform: rotate(45deg);
          margin-top: -2px;
        "></div>
      </div>
    `,
    className: 'custom-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

export default function SelectedLocationMarker() {
  const map = useMap();
  const { clickedPoint } = useAppStore();

  useEffect(() => {
    if (!clickedPoint) return;

    const pinIcon = createPinIcon();
    const marker = L.marker([clickedPoint.lat, clickedPoint.lon], { icon: pinIcon });

    // Add popup with location info
    if (clickedPoint.address) {
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 4px; color: #1F2937;">
            📍 Selected Location
          </div>
          <div style="font-size: 14px; color: #374151; margin-bottom: 2px;">
            ${clickedPoint.address.formatted}
          </div>
          ${clickedPoint.address.city || clickedPoint.address.state || clickedPoint.address.country ? `
            <div style="font-size: 12px; color: #6B7280;">
              ${[clickedPoint.address.city, clickedPoint.address.state, clickedPoint.address.country].filter(Boolean).join(', ')}
            </div>
          ` : ''}
          <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
            Elevation: ${clickedPoint.elevation?.toFixed(1)}m | SLA: ${clickedPoint.seaLevel?.toFixed(1)}mm
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
    }

    marker.addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [map, clickedPoint]);

  return null;
}
