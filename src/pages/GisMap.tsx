import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

declare global {
  interface Window {
    L: any;
  }
}

const API_BASE = "http://127.0.0.1:5000";

const SLRGISViewer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  const baseLayerRef = useRef<any>(null);
  const elevationLayerRef = useRef<any>(null);
  const inundationLayerRef = useRef<any>(null);

  // =======================
  // UI STATE
  // =======================
  const [year, setYear] = useState(2025);
  const [subsidenceRate, setSubsidenceRate] = useState(300); // mm/tahun

  const [basemap, setBasemap] =
    useState<"satellite" | "osm" | "terrain">("satellite");

  const [showElevation, setShowElevation] = useState(true);
  const [showInundation, setShowInundation] = useState(true);

  const [analysis, setAnalysis] = useState<any>(null);

  // =======================
  // LOAD LEAFLET
  // =======================
  const loadLeaflet = async () => {
    if (!window.L) {
      await Promise.all([
        new Promise((r) => {
          const s = document.createElement("script");
          s.src =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
          s.onload = r;
          document.head.appendChild(s);
        }),
        new Promise((r) => {
          const l = document.createElement("link");
          l.rel = "stylesheet";
          l.href =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
          document.head.appendChild(l);
          r(true);
        }),
      ]);
    }
  };

  // =======================
  // BASEMAP FACTORY
  // =======================
  const createBasemapLayer = (type: string) => {
    const L = window.L;

    if (type === "osm") {
      return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      });
    }

    if (type === "terrain") {
      return L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
          attribution: "© Esri",
        }
      );
    }

    return L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 18,
        attribution: "© Esri World Imagery",
      }
    );
  };

  // =======================
  // LOAD ELEVATION TILE
  // =======================
  const loadElevationLayer = async () => {
    const res = await fetch(`${API_BASE}/api/map/elevation`);
    const data = await res.json();

    if (elevationLayerRef.current) {
      mapInstance.current.removeLayer(elevationLayerRef.current);
    }

    elevationLayerRef.current = window.L.tileLayer(data.tile_url, {
      opacity: 0.9,
      attribution: "© Google Earth Engine | NASADEM",
    });

    if (showElevation) {
      elevationLayerRef.current.addTo(mapInstance.current);
    }
  };

  // =======================
  // LOAD INUNDATION TILE (DINAMIS)
  // =======================
  const loadInundationLayer = async (year: number) => {
    const res = await fetch(
      `${API_BASE}/api/map/inundation?year=${year}&subsidence_rate_mm=${subsidenceRate}`
    );
    const data = await res.json();

    if (inundationLayerRef.current) {
      mapInstance.current.removeLayer(inundationLayerRef.current);
    }

    inundationLayerRef.current = window.L.tileLayer(data.tile_url, {
      opacity: 0.6,
      attribution: "© Google Earth Engine | NASADEM",
    });

    if (showInundation) {
      inundationLayerRef.current.addTo(mapInstance.current);
    }
  };

  // =======================
  // LOAD SLR INFO
  // =======================
  const loadSLR = async (year: number) => {
    const res = await fetch(`${API_BASE}/api/slr?year=${year}`);
    const data = await res.json();
    setAnalysis(data);
  };

  // =======================
  // INIT MAP
  // =======================
  useEffect(() => {
    if (!mapRef.current) return;

    const init = async () => {
      await loadLeaflet();

      const L = window.L;
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      });
      mapInstance.current = map;

      baseLayerRef.current = createBasemapLayer("satellite").addTo(map);
      map.setView([-8.3, 113.7], 9);

      await loadElevationLayer();
      await loadInundationLayer(year);
      await loadSLR(year);
    };

    init();
    return () => mapInstance.current?.remove();
  }, []);

  // =======================
  // YEAR CHANGE
  // =======================
  useEffect(() => {
    if (!mapInstance.current) return;
    loadInundationLayer(year);
    loadSLR(year);
  }, [year]);

  // =======================
  // SUBSIDENCE CHANGE
  // =======================
  useEffect(() => {
    if (!mapInstance.current) return;
    loadInundationLayer(year);
  }, [subsidenceRate]);

  // =======================
  // BASEMAP SWITCH
  // =======================
  useEffect(() => {
    if (!mapInstance.current) return;

    if (baseLayerRef.current) {
      mapInstance.current.removeLayer(baseLayerRef.current);
    }

    baseLayerRef.current = createBasemapLayer(basemap);
    baseLayerRef.current.addTo(mapInstance.current);
  }, [basemap]);

  // =======================
  // TOGGLE OVERLAYS
  // =======================
  useEffect(() => {
    if (!mapInstance.current || !elevationLayerRef.current) return;
    showElevation
      ? elevationLayerRef.current.addTo(mapInstance.current)
      : mapInstance.current.removeLayer(elevationLayerRef.current);
  }, [showElevation]);

  useEffect(() => {
    if (!mapInstance.current || !inundationLayerRef.current) return;
    showInundation
      ? inundationLayerRef.current.addTo(mapInstance.current)
      : mapInstance.current.removeLayer(inundationLayerRef.current);
  }, [showInundation]);

  // =======================
  // RENDER
  // =======================
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">

      {/* MAP */}
      <div ref={mapRef} className="absolute inset-0 z-0" style={{ top: "72px" }} />

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gray-900/95 p-4 backdrop-blur border-b-2 border-yellow-900 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT : TITLE */}
          <div className="flex items-center gap-2">
            <MapPin className="text-purple-400" />
            <div>
              <h1 className="text-xl font-bold">Sea Level Rise Simulation</h1>
              <p className="text-xs text-gray-400">
                NASADEM (GEE) | Kabupaten Jember
              </p>
            </div>
          </div>

          {/* RIGHT : NAVIGATION */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/gis-map"
              className={({ isActive }) =>
                `transition-colors ${isActive
                  ? "text-purple-400 border-b-2 border-purple-400 pb-1"
                  : "text-gray-300 hover:text-white"
                }`
              }
            >
              GIS Map
            </NavLink>

            <NavLink
              to="/visualization"
              className={({ isActive }) =>
                `transition-colors ${isActive
                  ? "text-purple-400 border-b-2 border-purple-400 pb-1"
                  : "text-gray-300 hover:text-white"
                }`
              }
            >
              Time Series Visualization
            </NavLink>
          </nav>

        </div>
      </div>


      {/* CONTROL PANEL */}
      <div className="absolute top-24 left-6 z-50 bg-gray-800/95 border-2 border-yellow-900 backdrop-blur p-4 rounded-xl w-80 shadow-md">

        {/* YEAR */}
        <label className="block text-sm mb-2">
          Tahun: <b className="text-purple-400">{year}</b>
        </label>
        <input
          type="range"
          min={2025}
          max={2050}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full accent-purple-500"
        />

        {/* SUBSIDENCE */}
        <div className="mt-4">
          <label className="block text-sm mb-2">
            Subsidence Rate:
            <b className="text-orange-400 ml-1">
              {(subsidenceRate / 10).toFixed(1)} cm/tahun
            </b>
          </label>

          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={subsidenceRate}
            onChange={(e) => setSubsidenceRate(Number(e.target.value))}
            className="w-full accent-orange-500"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 cm</span>
            <span>50 cm</span>
          </div>
        </div>

        {/* BASEMAP */}
        <div className="mt-4">
          <p className="text-sm mb-2 font-semibold text-purple-300">
            Basemap
          </p>
          <div className="space-y-1 text-sm">
            {["satellite", "osm", "terrain"].map((b) => (
              <label key={b} className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="basemap"
                  checked={basemap === b}
                  onChange={() => setBasemap(b as any)}
                />
                {b === "satellite" && "Satellite"}
                {b === "osm" && "OpenStreetMap"}
                {b === "terrain" && "Terrain"}
              </label>
            ))}
          </div>
        </div>

        {/* OVERLAYS */}
        <div className="mt-4 space-y-2 text-sm">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={showElevation}
              onChange={() => setShowElevation(!showElevation)}
            />
            Elevation (DEM)
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={showInundation}
              onChange={() => setShowInundation(!showInundation)}
            />
            Inundation
          </label>
        </div>
      </div>

      {/* ELEVATION LEGEND */}
      <div className="absolute bottom-6 left-6 z-50 bg-gray-800/95 
                border-2 border-yellow-900 backdrop-blur 
                p-4 rounded-xl w-64 shadow-md pointer-events-none">

        <h4 className="text-sm font-semibold mb-2 text-purple-300">
          Elevation (m)
        </h4>

        <div
          className="h-4 rounded"
          style={{
            background:
              "linear-gradient(to right, #006400, #7FFF00, #FFFF00, #FFA500, #A52A2A, #FFFFFF)",
          }}
        />

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>2000+</span>
        </div>
      </div>

      {/* INUNDATION LEGEND */}
      <div className="absolute bottom-6 right-6 z-50 bg-gray-800/95 
                border-2 border-yellow-900 backdrop-blur 
                p-4 rounded-xl w-56 shadow-md pointer-events-none">

        <h4 className="text-sm font-semibold mb-2 text-purple-300">
          Inundation
        </h4>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-4 h-4 bg-blue-500/60 rounded"></div>
          <span>Area Tergenang</span>
        </div>
      </div>

      {/* ANALYSIS PANEL */}
      {analysis && (
        <div className="absolute top-24 right-6 z-50 bg-gray-800/95 border-2 border-yellow-900 backdrop-blur p-4 rounded-xl w-72">
          <h3 className="font-semibold mb-2">Analisis {year}</h3>
          <p className="text-sm">
            Sea Level Rise: <b>{analysis.slr_m?.toFixed(3)} m</b>
          </p>
          <p className="text-sm">
            Subsidence Rate:
            <b className="text-orange-400 ml-1">
              {(subsidenceRate / 10).toFixed(1)} cm/tahun
            </b>
          </p>
        </div>
      )}
    </div>
  );
};

export default SLRGISViewer;
