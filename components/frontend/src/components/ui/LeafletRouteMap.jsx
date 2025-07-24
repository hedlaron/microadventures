import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Helper to geocode an address to [lat, lng] using Nominatim
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data[0]) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}

// Helper to fetch route polyline from OSRM (Open Source Routing Machine)
async function fetchRoute(start, end, setRoute) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.routes && data.routes[0]) {
    setRoute(
      data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    );
  }
}

const LeafletRouteMap = ({
  start,
  end,
  startLabel = "Start",
  endLabel = "Destination",
}) => {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function resolveCoords() {
      setLoading(true);
      setError(null);
      let s = start;
      let e = end;
      try {
        if (typeof start === "string") {
          s = await geocodeAddress(start);
        }
        if (typeof end === "string") {
          e = await geocodeAddress(end);
        }
        if (!cancelled) {
          setStartCoords(s);
          setEndCoords(e);
        }
      } catch {
        if (!cancelled) setError("Could not geocode address");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (start && end) {
      resolveCoords();
    }
    return () => {
      cancelled = true;
    };
  }, [start, end]);

  useEffect(() => {
    if (startCoords && endCoords) {
      fetchRoute(startCoords, endCoords, setRoute);
    }
  }, [startCoords, endCoords]);

  if (!start || !end) return null;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-40 text-xs text-orange-600">
        Loading map…
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;
  if (!startCoords || !endCoords) return null;

  // Fit map to route bounds if available
  const MapWithFitBounds = () => {
    const mapRef = React.useRef();
    useEffect(() => {
      if (route && mapRef.current) {
        const leafletMap = mapRef.current;
        leafletMap.fitBounds(route, { padding: [30, 30], maxZoom: 16 });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);
    return (
      <MapContainer
        center={startCoords}
        zoom={13}
        style={{
          height: "320px",
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
        }}
        scrollWheelZoom={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker
          position={startCoords}
          icon={L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconSize: [28, 44],
            iconAnchor: [14, 44],
            popupAnchor: [0, -40],
          })}
        >
          <Popup>{startLabel}</Popup>
        </Marker>
        <Marker
          position={endCoords}
          icon={L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconSize: [28, 44],
            iconAnchor: [14, 44],
            popupAnchor: [0, -40],
          })}
        >
          <Popup>{endLabel}</Popup>
        </Marker>
        {route && (
          <Polyline
            positions={route}
            color="#3b82f6"
            weight={6}
            opacity={0.85}
          />
        )}
      </MapContainer>
    );
  };
  return <MapWithFitBounds />;
};

export default LeafletRouteMap;
