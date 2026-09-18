"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Currency } from '@/config/currencies';

// Fix for Leaflet default icons in Next.js (though we use custom DivIcon mostly, this prevents missing icon errors if fallback occurs)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically update bounds when properties change
function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [bounds, map]);
  return null;
}

interface PropertiesMapProps {
  properties: any[];
  activeCurrency: Currency;
  formatPrice: (price: number, currency: Currency) => string;
  convertFromMAD: (priceMAD: number, currency: Currency) => number;
  onSelectProperty: (property: any) => void;
}

export default function PropertiesMap({ properties, activeCurrency, formatPrice, convertFromMAD, onSelectProperty }: PropertiesMapProps) {
  const bounds = properties.length > 0 
    ? L.latLngBounds(properties.map(p => [p.coords[0], p.coords[1]]))
    : null;

  return (
    <MapContainer 
      center={[34.037, -4.995]} // Default to Fès center
      zoom={13} 
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl md:rounded-l-none border-l border-slate-200 shadow-inner z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {bounds && <ChangeView bounds={bounds} />}

      {properties.map(prop => {
        const price = convertFromMAD(prop.price, activeCurrency);
        const displayPrice = formatPrice(price, activeCurrency);
        
        // Custom HTML Icon for Price Bubble
        const customIcon = L.divIcon({
          className: 'bg-transparent border-none',
          html: `<div class="bg-white hover:bg-amber-500 hover:text-white text-slate-950 font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200 transition-colors whitespace-nowrap text-sm flex items-center justify-center">${displayPrice}</div>`,
          iconSize: [60, 30],
          iconAnchor: [30, 15],
          popupAnchor: [0, -15],
        });

        return (
          <Marker 
            key={prop.id} 
            position={[prop.coords[0], prop.coords[1]]}
            icon={customIcon}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="w-56 overflow-hidden rounded-xl flex flex-col group cursor-pointer" onClick={() => onSelectProperty(prop)}>
                <div className="h-32 w-full relative">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span className="text-xs font-bold text-slate-900">{prop.rating}</span>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-extrabold text-sm text-slate-950 mb-1 leading-tight line-clamp-1">{prop.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">{prop.guests} voyageurs • {prop.bedrooms} ch.</p>
                  <button className="w-full bg-slate-950 text-white font-bold text-xs py-2 rounded-lg hover:bg-amber-500 transition-colors">
                    Voir disponibilités
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
