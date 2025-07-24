import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

// Ref to track cancellation across async calls
const cancelledRef = { current: false };

// Helper to geocode an address to [lat, lng] using Nominatim
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  // eslint-disable-next-line no-console
  console.log("[geocodeAddress] Geocoding address:", address);
  const data = await res.json();
  // eslint-disable-next-line no-console
  console.log("[geocodeAddress] Geocode result for", address, ":", data);
  if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
    const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    // eslint-disable-next-line no-console
    console.log(`[geocodeAddress] Using coords for ${address}:`, coords);
    return coords;
  }
  // eslint-disable-next-line no-console
  console.warn(
    "[geocodeAddress] No valid geocode result for address:",
    address,
    data,
  );
  return null;
}

// Helper to fetch route polyline from OSRM (Open Source Routing Machine)
async function fetchRoute(start, end, setRoute, setError) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  // eslint-disable-next-line no-console
  console.log("[fetchRoute] Fetching route:", url);
  try {
    const res = await fetch(url);
    // eslint-disable-next-line no-console
    console.log("[fetchRoute] Response status:", res.status);
    const data = await res.json();
    // eslint-disable-next-line no-console
    console.log("[fetchRoute] Route fetch result:", data);
    if (data.routes && data.routes[0]) {
      const poly = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
      // eslint-disable-next-line no-console
      console.log("[fetchRoute] Setting route polyline:", poly);
      setRoute(poly);
    } else {
      // eslint-disable-next-line no-console
      console.warn("[fetchRoute] No route found in response:", data);
      setError("Could not fetch route between locations");
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[fetchRoute] Route fetch error:", err);
    setError("Could not fetch route between locations");
  }
}

const LeafletRouteMap = ({
  start,
  end,
  startLabel = "Start",
  endLabel = "Destination",
}) => {
  const [coords, setCoords] = React.useState({ start: null, end: null });
  const [route, setRoute] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Debug log for incoming props
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("LeafletRouteMap props:", { start, end, startLabel, endLabel });
  }, [start, end, startLabel, endLabel]);

  // Memoize start/end values to prevent unnecessary reloads
  const prevStart = React.useRef();
  const prevEnd = React.useRef();

  useEffect(() => {
    cancelledRef.current = false;
    async function resolveCoords() {
      setLoading(true);
      setError(null);
      let s = start;
      let e = end;
      try {
        if (typeof start === "string" && typeof end === "string") {
          // Run both geocoding calls in parallel
          const [sResult, eResult] = await Promise.all([
            geocodeAddress(start),
            geocodeAddress(end),
          ]);
          if (!sResult) {
            console.error(
              `[LeafletRouteMap] Could not geocode start: ${start}`,
            );
            throw new Error(`Could not geocode start: ${start}`);
          }
          if (!eResult) {
            console.error(`[LeafletRouteMap] Could not geocode end: ${end}`);
            throw new Error(`Could not geocode end: ${end}`);
          }
          s = sResult;
          e = eResult;
        } else if (typeof start === "string") {
          s = await geocodeAddress(start);
          if (!s) {
            console.error(
              `[LeafletRouteMap] Could not geocode start: ${start}`,
            );
            throw new Error(`Could not geocode start: ${start}`);
          }
        } else if (typeof end === "string") {
          e = await geocodeAddress(end);
          if (!e) {
            console.error(`[LeafletRouteMap] Could not geocode end: ${end}`);
            throw new Error(`Could not geocode end: ${end}`);
          }
        }
        // Only update state if not cancelled after geocoding completes
        if (!cancelledRef.current) {
          console.log("[LeafletRouteMap] Setting coords:", {
            start: s,
            end: e,
          });
          setCoords((prev) => {
            const newCoords = { start: s, end: e };
            console.log(
              "[LeafletRouteMap] setCoords callback, newCoords:",
              newCoords,
            );
            return newCoords;
          });
        }
      } catch (err) {
        console.error("[LeafletRouteMap] Error in resolveCoords:", err);
        if (!cancelledRef.current)
          setError(err.message || "Could not geocode address");
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    }
    // Only resolve if start/end changed
    if (
      start &&
      end &&
      (start !== prevStart.current || end !== prevEnd.current)
    ) {
      prevStart.current = start;
      prevEnd.current = end;
      resolveCoords();
    }
    return () => {
      cancelledRef.current = true;
    };
  }, [start, end]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[LeafletRouteMap] coords effect run, coords:", coords);
    if (coords.start && coords.end) {
      console.log(
        "[LeafletRouteMap] Triggering fetchRoute with:",
        coords.start,
        coords.end,
      );
      fetchRoute(coords.start, coords.end, setRoute, setError);
    } else {
      console.log(
        "[LeafletRouteMap] Not triggering fetchRoute, missing coords:",
        coords,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  // Timeout fallback: if loading for more than 10s, show error
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setError("Map loading timed out. Please try again.");
      setLoading(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (!start || !end) return null;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-40 text-xs text-orange-600">
        <svg
          className="animate-spin h-6 w-6 mb-2 text-orange-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        Loading map…
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-40 text-xs text-red-600">
        Map error: {error}
      </div>
    );
  if (!coords.start || !coords.end) return null;

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
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 16,
          overflow: "hidden",
          // border: "4px solid red", // Debug border removed
          background: "#ffe4e1", // Debug background
          minHeight: 320,
        }}
      >
        <MapContainer
          center={coords.start}
          zoom={13}
          style={{
            height: "320px",
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
            zIndex: 1,
            // border: "2px dashed blue", // Debug border for MapContainer removed
            background: "#e0f7fa", // Debug background for MapContainer
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
            position={coords.start}
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
            position={coords.end}
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
      </div>
    );
  };
  return <MapWithFitBounds />;
};

export default LeafletRouteMap;
