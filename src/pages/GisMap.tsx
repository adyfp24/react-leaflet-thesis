import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    L: any;
  }
}

const GisMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const baseLayerRef = useRef<any>(null);

  // UI State
  const [showCoastline, setShowCoastline] = useState(true);
  const [showTileBox, setShowTileBox] = useState(true);
  const [showSeaLevelRise, setShowSeaLevelRise] = useState(false);
  const [year, setYear] = useState(2040);
  const [basemap, setBasemap] = useState<"satellite" | "osm">("satellite");

  // Study area (MATCH DATASET SLA)
  const tileBounds = {
    north: -8.427068113123065,
    south: -8.616956880254662,
    west: 113.53192284124258,
    east: 113.73236098432594,
  };

  // -------------------------
  // Utils
  // -------------------------
  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject();
      document.head.appendChild(s);
    });

  const loadCSS = (href: string) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  };

  // -------------------------
  // REAL SLR INUNDATION (API)
  // -------------------------
  const fetchInundationLayer = async (map: any, year: number) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/inundation?year=${year}`
      );

      if (!res.ok) throw new Error("Failed to fetch inundation");

      const geojson = await res.json();

      if (map._seaLevelLayer) {
        map.removeLayer(map._seaLevelLayer);
        map._seaLevelLayer = null;
      }

      map._seaLevelLayer = window.L.geoJSON(geojson, {
        style: {
          fillColor: "#dc2626",
          fillOpacity: 0.45,
          weight: 0,
        },
      }).addTo(map);

    } catch (err) {
      console.error("Inundation fetch error:", err);
    }
  };

  // -------------------------
  // INIT MAP
  // -------------------------
  useEffect(() => {
    if (!mapRef.current) return;

    const init = async () => {
      loadCSS("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js");

      const L = window.L;
      const map = L.map(mapRef.current);
      mapInstance.current = map;

      baseLayerRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri" }
      ).addTo(map);

      // Tile boundary
      const tilePoly = L.polygon(
        [
          [tileBounds.north, tileBounds.west],
          [tileBounds.north, tileBounds.east],
          [tileBounds.south, tileBounds.east],
          [tileBounds.south, tileBounds.west],
        ],
        { color: "#7e22ce", dashArray: "6,4", fillOpacity: 0 }
      ).addTo(map);

      map._tilePoly = tilePoly;
      map.fitBounds(tilePoly.getBounds());

      // Fetch coastline (Overpass)
      const pad = 0.05;
      const query = `
        [out:json];
        way["natural"="coastline"](${tileBounds.south - pad},${tileBounds.west - pad},
                                   ${tileBounds.north + pad},${tileBounds.east + pad});
        out geom;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: new URLSearchParams({ data: query }),
      });

      const json = await res.json();
      const geojson = overpassToGeoJSON(json);

      map._coastlineLayer = L.geoJSON(geojson, {
        style: { color: "#2563eb", weight: 2 },
      }).addTo(map);
    };

    init();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // -------------------------
  // Toggle layers
  // -------------------------
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (map._coastlineLayer) {
      showCoastline
        ? map.addLayer(map._coastlineLayer)
        : map.removeLayer(map._coastlineLayer);
    }

    if (map._tilePoly) {
      showTileBox
        ? map.addLayer(map._tilePoly)
        : map.removeLayer(map._tilePoly);
    }
  }, [showCoastline, showTileBox]);

  // -------------------------
  // Sea Level Rise (REAL API)
  // -------------------------
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (showSeaLevelRise) {
      fetchInundationLayer(map, year);
    } else if (map._seaLevelLayer) {
      map.removeLayer(map._seaLevelLayer);
      map._seaLevelLayer = null;
    }
  }, [showSeaLevelRise, year]);

  // -------------------------
  // Basemap switch
  // -------------------------
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    map.removeLayer(baseLayerRef.current);

    const L = window.L;
    baseLayerRef.current =
      basemap === "satellite"
        ? L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        )
        : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

    baseLayerRef.current.addTo(map);
  }, [basemap]);

  // -------------------------
  // Update SLR layer on year change
  // -------------------------
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (showSeaLevelRise) {
      fetchInundationLayer(map, year);
    } else if (map._seaLevelLayer) {
      map.removeLayer(map._seaLevelLayer);
      map._seaLevelLayer = null;
    }

  }, [showSeaLevelRise, year]);


  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <div className="p-3 bg-gray-800 flex gap-4 items-center">
        <strong className="text-sm">
          GIS-based Bathtub Inundation (Hybrid STL–LSTM Forecast)
        </strong>

        <div className="ml-auto flex gap-4 items-center text-sm">
          <label>
            <input type="checkbox" checked={showCoastline}
              onChange={() => setShowCoastline(!showCoastline)} /> Coastline
          </label>

          <label>
            <input type="checkbox" checked={showTileBox}
              onChange={() => setShowTileBox(!showTileBox)} /> AOI
          </label>

          <label>
            <input type="checkbox" checked={showSeaLevelRise}
              onChange={() => setShowSeaLevelRise(!showSeaLevelRise)} /> SLR
          </label>

          <select value={year} onChange={e => setYear(+e.target.value)}
            className="bg-gray-700 px-2">
            {Array.from({ length: 26 }, (_, i) => 2025 + i)
              .map(y => <option key={y}>{y}</option>)}
          </select>

          <select value={basemap}
            onChange={e => setBasemap(e.target.value as any)}
            className="bg-gray-700 px-2">
            <option value="satellite">Satellite</option>
            <option value="osm">OSM</option>
          </select>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-[calc(100vh-56px)]" />
    </div>
  );
};

export default GisMap;

// -------------------------
// Overpass → GeoJSON
// -------------------------
function overpassToGeoJSON(data: any) {
  const features = (data.elements || [])
    .filter((el: any) => el.type === "way" && el.geometry)
    .map((el: any) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: el.geometry.map((p: any) => [p.lon, p.lat]),
      },
      properties: el.tags || {},
    }));

  return { type: "FeatureCollection", features };
}
