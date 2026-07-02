import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import mockData from '../../data/mockSchema.json';

const CrimeHeatmap = () => {
  // Center of Karnataka (approx)
  const position = [14.0, 75.5];

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-700 shadow-xl relative z-0">
      <MapContainer center={position} zoom={6} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {mockData.CaseMaster.map((caseItem) => {
          const isHeinous = caseItem.GravityOffenceID === 1;
          return (
            <CircleMarker
              key={caseItem.CaseMasterID}
              center={[caseItem.latitude, caseItem.longitude]}
              pathOptions={{
                color: isHeinous ? '#e11d48' : '#fbbf24',
                fillColor: isHeinous ? '#e11d48' : '#fbbf24',
                fillOpacity: 0.6,
              }}
              radius={isHeinous ? 10 : 6}
            >
              <Popup className="bg-slate-900 border-none">
                <div className="p-2">
                  <h4 className="font-bold text-slate-800">{caseItem.CrimeNo}</h4>
                  <p className="text-xs text-slate-600 mt-1">{caseItem.BriefFacts}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CrimeHeatmap;
