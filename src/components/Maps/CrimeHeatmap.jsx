import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useData } from '../../context/DataContext';

const createHeatmapIcon = (riskLevel, name) => {
  return L.divIcon({
    html: `
      <div class="heatmap-patch-${riskLevel}"></div>
      <div class="heatmap-label">${name}</div>
    `,
    className: 'custom-heatmap-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const CrimeHeatmap = ({ theme, data, hotspots = [], center = [14.0, 75.5], zoom = 6 }) => {
  const { data: mockData, loading } = useData();
  
  const displayData = data || (mockData ? mockData.CaseMaster : []);

  if (loading || !mockData) {
    return <div className="flex h-full items-center justify-center text-slate-400">Loading map...</div>;
  }

  const tileUrl = theme === 'dark' 
    ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
    : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

  return (
    <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 relative z-0 rounded-xl">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          key={theme} // Force re-render of TileLayer when theme changes
          attribution='&copy; Google Maps'
          url={tileUrl}
        />
        {hotspots && hotspots.length > 0 ? (
          hotspots.map((spot) => (
            <Marker 
              key={spot.id} 
              position={spot.coords} 
              icon={createHeatmapIcon(spot.riskLevel, spot.name)}
            />
          ))
        ) : (
          displayData.map((caseItem) => {
            const isHeinous = caseItem.GravityOffenceID === 1;
            const color = isHeinous ? '#e11d48' : '#f59e0b';
            return (
              <CircleMarker
                key={caseItem.CaseMasterID}
                center={[caseItem.latitude, caseItem.longitude]}
                pathOptions={{
                  stroke: false,
                  fillColor: color,
                  fillOpacity: 0.35,
                }}
                radius={isHeinous ? 25 : 18}
              >
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1 border-b pb-1 border-slate-200">{caseItem.CrimeNo}</h4>
                    <p className="text-xs text-slate-600 leading-tight mt-1">{caseItem.BriefFacts}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })
        )}
      </MapContainer>
      
      {/* Overlay to give it an inset shadow/glow feel */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_0_30px_rgba(15,23,42,0.8)] z-[1000] rounded-xl"></div>
    </div>
  );
};

export default CrimeHeatmap;
