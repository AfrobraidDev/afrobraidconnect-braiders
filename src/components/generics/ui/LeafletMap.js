"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

const isValidCoord = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    isFinite(latNum) &&
    isFinite(lngNum) &&
    Math.abs(latNum) <= 90 &&
    Math.abs(lngNum) <= 180
  );
};

function MapController({ activeLocation }) {
  const map = useMap();

  const hasFlownToRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    const attemptFly = () => {
      if (
        !activeLocation ||
        !isValidCoord(activeLocation.latitude, activeLocation.longitude)
      )
        return;

      const size = map.getSize();
      if (size.x > 0 && size.y > 0) {
        try {
          map.flyTo([activeLocation.latitude, activeLocation.longitude], 14, {
            animate: true,
            duration: 1.2,
          });
        } catch (e) {
          console.warn(e);
        }
      }
    };

    attemptFly();

    map.on("resize", attemptFly);

    return () => {
      map.off("resize", attemptFly);
    };
  }, [activeLocation, map]);

  return null;
}

export default function LeafletMap({ locations, activeId }) {
  const activeLocs = useMemo(
    () =>
      Object.entries(locations)
        .map(([id, l]) => ({ id, ...l }))
        .filter((l) => isValidCoord(l.latitude, l.longitude)),
    [locations]
  );

  const activeLocation = useMemo(
    () => activeLocs.find((l) => l.id === activeId) || activeLocs[0] || null,
    [activeLocs, activeId]
  );

  const center = useMemo(() => {
    if (
      activeLocation &&
      isValidCoord(activeLocation.latitude, activeLocation.longitude)
    ) {
      return [activeLocation.latitude, activeLocation.longitude];
    }
    return [52.52, 13.405];
  }, [activeLocation]);

  return (
    <div style={{ height: "100%", width: "100%", isolation: "isolate" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
        scrollWheelZoom={false}
        touchZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController activeLocation={activeLocation} />

        {activeLocs.map((loc) => {
          const isActive = loc.id === activeId;
          return (
            <div key={loc.id}>
              <Marker
                position={[loc.latitude, loc.longitude]}
                opacity={isActive ? 1 : 0.6}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{loc.address}</strong>
                    <br />
                    {loc.city}, {loc.country}
                  </div>
                </Popup>
              </Marker>

              {loc.radius_km &&
                !isNaN(loc.radius_km) &&
                parseFloat(loc.radius_km) > 0 && (
                  <Circle
                    center={[loc.latitude, loc.longitude]}
                    pathOptions={{
                      fillColor: isActive ? "#b5734c" : "#888",
                      color: isActive ? "#b5734c" : "#888",
                      weight: 1,
                      fillOpacity: isActive ? 0.2 : 0.1,
                    }}
                    radius={parseFloat(loc.radius_km) * 1000}
                  />
                )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
