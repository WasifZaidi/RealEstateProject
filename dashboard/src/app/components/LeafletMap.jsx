import { useEffect, useRef, useState } from "react";
import L from "leaflet";

// SVG-based pin icon as fallback (always works)
const createSvgIcon = () => {
  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
            fill="#DC2626" 
            stroke="#991B1B" 
            stroke-width="0.5"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "custom-map-pin"
  });
};

// Try to use custom image, fallback to SVG
const createPinIcon = () => {
  // Check if custom pin image exists
  const img = new Image();
  img.src = "/pin.png";
  
  return new Promise((resolve) => {
    img.onload = () => {
      resolve(L.icon({
        iconUrl: "/pin.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: "custom-map-pin"
      }));
    };
    
    img.onerror = () => {
      console.warn("Custom pin icon not found, using SVG fallback");
      resolve(createSvgIcon());
    };
    
    // Timeout after 2 seconds
    setTimeout(() => {
      resolve(createSvgIcon());
    }, 2000);
  });
};

export default function LeafletMap({ coordinates, onMapClick }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [iconReady, setIconReady] = useState(false);
  const pinIconRef = useRef(null);

  // Load icon asynchronously
  useEffect(() => {
    createPinIcon().then((icon) => {
      pinIconRef.current = icon;
      setIconReady(true);
    });
  }, []);


  useEffect(() => {
  function handleMoveEvent(e) {
    const { lat, lng } = e.detail;
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
    }
  }

  window.addEventListener("move-map-to", handleMoveEvent);

  return () => window.removeEventListener("move-map-to", handleMoveEvent);
}, []);


  // Initialize map only once icon is ready
  useEffect(() => {
    if (!iconReady || mapRef.current) return;

    // Validate coordinates
    if (!coordinates || 
        typeof coordinates.lat !== 'number' || 
        typeof coordinates.lng !== 'number' ||
        isNaN(coordinates.lat) || 
        isNaN(coordinates.lng)) {
      console.error("Invalid coordinates provided");
      return;
    }

    try {
      // Initialize map
      mapRef.current = L.map("property-map", {
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true
      }).setView([coordinates.lat, coordinates.lng], 14);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Create marker with loaded icon
      markerRef.current = L.marker(
        [coordinates.lat, coordinates.lng],
        { 
          icon: pinIconRef.current, 
          draggable: true,
          autoPan: true
        }
      ).addTo(mapRef.current);

      // Drag event handler
      markerRef.current.on("dragend", () => {
        const pos = markerRef.current.getLatLng();
        if (onMapClick && typeof onMapClick === 'function') {
          onMapClick({ lat: pos.lat, lng: pos.lng });
        }
      });

      // Map click event handler
      mapRef.current.on("click", (e) => {
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
          if (onMapClick && typeof onMapClick === 'function') {
            onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
          }
        }
      });

    } catch (error) {
      console.error("Failed to initialize map:", error);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [iconReady]);

  // Update marker & map when coordinates change
  useEffect(() => {
    if (!markerRef.current || !mapRef.current || !iconReady) return;

    // Validate new coordinates
    if (!coordinates || 
        typeof coordinates.lat !== 'number' || 
        typeof coordinates.lng !== 'number' ||
        isNaN(coordinates.lat) || 
        isNaN(coordinates.lng)) {
      return;
    }

    try {
      const newLatLng = L.latLng(coordinates.lat, coordinates.lng);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, 15, { animate: true });
    } catch (error) {
      console.error("Failed to update marker position:", error);
    }
  }, [coordinates, iconReady]);

  return (
    <div className="relative w-full h-full">
      <div id="property-map" className="w-full h-full" />
      {!iconReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}
      <style jsx>{`
        .custom-map-pin {
          background: transparent;
          border: none;
        }
        #property-map {
          z-index: 0;
        }
      `}</style>
    </div>
  );
}