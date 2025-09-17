// src/components/JemberCoastlineViewer.tsx
import React, { useEffect, useRef, useState } from "react";

declare const turf: any;

const GisMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const baseLayerRef = useRef<any>(null);

  // Toggles
  const [showCoastline, setShowCoastline] = useState(true);
  const [showTileBox, setShowTileBox] = useState(true);
  const [showSeaLevelRise, setShowSeaLevelRise] = useState(false);

  // Tahun forecasting
  const [year, setYear] = useState<number>(2025);

  // Basemap state
  const [basemap, setBasemap] = useState<"satellite" | "osm">("satellite");

  // Papuma center
  const papuma: [number, number] = [-8.4306, 113.8428];

  // Tile metadata
  const tileBounds = { north: -8, south: -9, west: 113, east: 114 };

  // Helpers
  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed load script: " + src));
      document.head.appendChild(s);
    });

  const loadCSS = (href: string) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  };

  // Dummy rule: buffer per tahun
  const getBufferForYear = (y: number) => {
    return 0.5 + (y - 2025) * 0.2; // misal linear growth
  };

  // Update sea level rise layer
  const updateSeaRiseLayer = (map: any, year: number) => {
    try {
      const coastGeo = (map as any)._coastlineGeojson;
      if (!coastGeo || !(window as any).turf) return;

      const bufKm = getBufferForYear(year);

      const buffered = (window as any).turf.buffer(coastGeo, bufKm, {
        units: "kilometers",
      });

      const papumaLonLat = [papuma[1], papuma[0]];
      const aoiCircle = (window as any).turf.circle(papumaLonLat, 25, {
        units: "kilometers",
      });

      let impact = null;
      try {
        impact = (window as any).turf.intersect(buffered, aoiCircle);
      } catch {
        impact = buffered;
      }

      if ((map as any)._seaRiseLayer) {
        map.removeLayer((map as any)._seaRiseLayer);
        (map as any)._seaRiseLayer = null;
      }

      if (impact) {
        const seaLayer = (window as any).L.geoJSON(impact, {
          style: {
            color: "red",
            weight: 0,
            fillColor: "red",
            fillOpacity: 0.4,
          },
        }).addTo(map);

        (map as any)._seaRiseLayer = seaLayer;
      }
    } catch (err) {
      console.error("Failed updateSeaRiseLayer:", err);
    }
  };

  // Init map
  useEffect(() => {
    if (!mapRef.current) return;
    const load = async () => {
      loadCSS("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css");
      if (!(window as any).L) {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js");
      }
      if (!(window as any).turf) {
        await loadScript("https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js");
      }

      const L = (window as any).L;
      const map = L.map(mapRef.current);
      leafletMapRef.current = map;

      // Initial basemap
      const defaultLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri" }
      ).addTo(map);

      baseLayerRef.current = defaultLayer;

      const tilePoly = L.polygon(
        [
          [tileBounds.north, tileBounds.west],
          [tileBounds.north, tileBounds.east],
          [tileBounds.south, tileBounds.east],
          [tileBounds.south, tileBounds.west],
        ],
        { color: "#9900cc", weight: 2, dashArray: "6,4", fillOpacity: 0.02 }
      ).addTo(map);

      (map as any)._tilePoly = tilePoly;
      map.fitBounds(tilePoly.getBounds(), { padding: [40, 40] });

      const pad = 0.05;
      const query = `
        [out:json][timeout:25];
        (
          way["natural"="coastline"](${tileBounds.south - pad},${tileBounds.west - pad},${tileBounds.north + pad},${tileBounds.east + pad});
          relation["natural"="coastline"](${tileBounds.south - pad},${tileBounds.west - pad},${tileBounds.north + pad},${tileBounds.east + pad});
        );
        out body; >; out skel qt;
      `;

      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ data: query }).toString(),
        });
        const osmJson = await res.json();
        const geojson = overpassToGeoJSON(osmJson);

        (map as any)._coastlineGeojson = geojson;

        const coastlineLayer = L.geoJSON(geojson, {
          style: { color: "#0066cc", weight: 2 },
        }).addTo(map);

        (map as any)._coastline = coastlineLayer;

        updateSeaRiseLayer(map, year);
      } catch (err) {
        console.error("Failed to fetch coastline:", err);
      }
    };
    load();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Handle basemap switch
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    const L = (window as any).L;
    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
    }

    let newLayer;
    if (basemap === "satellite") {
      newLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri" }
      );
    } else {
      newLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      });
    }

    newLayer.addTo(map);
    baseLayerRef.current = newLayer;
  }, [basemap]);

  // Update SLR when toggles or year changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (showSeaLevelRise) {
      updateSeaRiseLayer(map, year);
    } else if ((map as any)._seaRiseLayer) {
      map.removeLayer((map as any)._seaRiseLayer);
      (map as any)._seaRiseLayer = null;
    }
  }, [showSeaLevelRise, year]);

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-3 bg-gray-800 flex gap-4 items-center">
        <h2 className="text-md max-w-3xl break-words">
          Sea Level Rise Prediction with Hybrid STL Decomposition–LSTM Model
          and GIS-Based Mapping of Affected Areas along the Coastline of Jember Regency
        </h2>

        <div className="ml-auto flex gap-6 items-center">
          {/* Basemap selector */}

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showCoastline} onChange={() => setShowCoastline(s => !s)} />
            <span className="text-sm">Coastline</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showTileBox} onChange={() => setShowTileBox(s => !s)} />
            <span className="text-sm">SRTM Tile Box</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showSeaLevelRise} onChange={() => setShowSeaLevelRise(s => !s)} />
            <span className="text-sm">SLR Simulation</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm">Basemap:</span>
            <select
              value={basemap}
              onChange={(e) => setBasemap(e.target.value as "satellite" | "osm")}
              className="text-white px-2 py-1 rounded bg-gray-700"
            >
              <option value="satellite">Satellite (Esri)</option>
              <option value="osm">OpenStreetMap</option>
            </select>
          </div>

          {/* Dropdown tahun */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Year:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-white px-2 py-1 rounded bg-gray-700"
            >
              {Array.from({ length: 26 }, (_, i) => 2025 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 h-[calc(100vh-120px)] relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 text-black p-4 rounded-lg shadow-lg max-w-xs z-[1000]">
          <div className="font-semibold mb-2">Legend</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px] bg-blue-600"></div>
              <span>Coastline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px] border-b-2 border-dashed border-purple-700"></div>
              <span>SRTM Tile Box</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-red-500 opacity-70"></div>
              <span>SLR Simulation</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="absolute top-28 left-4 bg-white/95 text-black p-4 rounded-lg shadow-lg max-w-sm z-[1000]">
          <div className="font-semibold mb-2">Study Area Info</div>
          <div className="text-sm space-y-1">
            <div><strong>Center:</strong> Pantai Papuma</div>
            <div><strong>Coordinates:</strong> {papuma[0].toFixed(4)}°S, {papuma[1].toFixed(4)}°E</div>
            <div><strong>Location:</strong> Desa Lojejer, Wuluhan</div>
            <div><strong>Radius:</strong> 25 km buffer zone</div>
            <div><strong>Forecast Year:</strong> {year}</div>
            {showSeaLevelRise && (
              <div className="mt-2 text-red-600 font-medium text-sm">
                ⚠ Potential area affected by sea level rise ({year})
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GisMap;

function overpassToGeoJSON(overpassJson: any) {
  const nodes: Record<string, [number, number]> = {};
  (overpassJson.elements || []).forEach((el: any) => {
    if (el.type === "node") nodes[el.id] = [el.lat, el.lon];
  });

  const features: any[] = [];
  (overpassJson.elements || []).forEach((el: any) => {
    if (el.type === "way") {
      const coords = (el.nodes || [])
        .map((nid: number) => nodes[nid] && [nodes[nid][1], nodes[nid][0]])
        .filter(Boolean);
      if (coords.length)
        features.push({
          type: "Feature",
          geometry: { type: "LineString", coordinates: coords },
          properties: el.tags || {},
        });
    }
  });

  return { type: "FeatureCollection", features };
}
