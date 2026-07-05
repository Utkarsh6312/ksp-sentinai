import React from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import mockData from '../../data/mockSchema.json';

const CrimeHeatmap = ({ theme }) => {
  // Center of Karnataka (approx)
  const position = [14.0, 75.5];

  const tileUrl = theme === 'dark' 
    ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
    : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

  return (
    <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 relative z-0 rounded-xl">
      <MapContainer center={position} zoom={6} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          key={theme} // Force re-render of TileLayer when theme changes
          attribution='&copy; Google Maps'
          url={tileUrl}
        />
        {mockData.CaseMaster.map((caseItem) => {
          const isHeinous = caseItem.GravityOffenceID === 1;
          const color = isHeinous ? '#e11d48' : '#f59e0b';
          return (
            <CircleMarker
              key={caseItem.CaseMasterID}
              center={[caseItem.latitude, caseItem.longitude]}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.6,
                weight: 2
              }}
              radius={isHeinous ? 12 : 7}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-800 text-sm mb-1 border-b pb-1 border-slate-200">{caseItem.CrimeNo}</h4>
                  <p className="text-xs text-slate-600 leading-tight mt-1">{caseItem.BriefFacts}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Overlay to give it an inset shadow/glow feel */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_0_30px_rgba(15,23,42,0.8)] z-[1000] rounded-xl"></div>
    </div>
  );
};

export default CrimeHeatmap;
