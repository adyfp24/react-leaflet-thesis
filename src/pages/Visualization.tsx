import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";

interface SLRData {
  year: number;
  kenaikan_tahunan_mm: number;
  kenaikan_kumulatif_mm: number;
}

const Visualization: React.FC = () => {
  const location = useLocation();

  const [data, setData] = useState<SLRData[]>([]);
  const [animatedData, setAnimatedData] = useState<SLRData[]>([]);
  const [chartKey, setChartKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH DATA (HANYA SEKALI)
  // ===============================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/slr/timeseries")
      .then((res) => res.json())
      .then((json: SLRData[]) => {
        setData(json);

        // initial zero data
        const zeroData = json.map((d) => ({
          ...d,
          kenaikan_tahunan_mm: 0,
          kenaikan_kumulatif_mm: 0,
        }));

        setAnimatedData(zeroData);
        setLoading(false);

        // animate first load
        setTimeout(() => {
          setAnimatedData(json);
        }, 120);
      })
      .catch((err) => {
        console.error("Failed to load SLR data:", err);
        setLoading(false);
      });
  }, []);

  // ===============================
  // RE-ANIMATE SAAT BALIK KE HALAMAN
  // ===============================
  useEffect(() => {
    if (data.length === 0) return;

    const zeroData = data.map((d) => ({
      ...d,
      kenaikan_tahunan_mm: 0,
      kenaikan_kumulatif_mm: 0,
    }));

    // reset data & force remount chart
    setAnimatedData(zeroData);
    setChartKey((k) => k + 1);

    const t = setTimeout(() => {
      setAnimatedData(data);
    }, 120);

    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
      {/* 🔹 Navbar */}
      {/* <div className="p-3 bg-gray-800 flex gap-4 items-center shadow-md">
        <h2 className="text-md max-w-3xl">
          Sistem Prediksi Kenaikan Muka Air Laut Berbasis Hybrid STL–LSTM
          (Pesisir Kabupaten Jember)
        </h2>
        <div className="ml-auto flex gap-6 items-center text-sm">
          <a href="/gis-map" className="hover:text-cyan-400">🌍 Peta GIS</a>
          <a href="/visualization" className="text-cyan-400 font-medium">📈 Visualisasi</a>
          <a href="/" className="hover:text-cyan-400">🏠 Beranda</a>
        </div>
      </div>
       */}

      {/* HEADER */}
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
      {/* 🔹 Konten */}
      <div className="flex-1 mt-20 p-6 flex flex-col md:flex-row gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Proyeksi Kenaikan Muka Air Laut (2025–2050)
          </h3>

          {loading ? (
            <p className="text-center text-gray-400">Memuat data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={420}>
              <LineChart key={chartKey} data={animatedData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#374151" />

                <XAxis
                  dataKey="year"
                  stroke="#d1d5db"
                  tick={{ fill: "#d1d5db" }}
                />

                <YAxis
                  stroke="#d1d5db"
                  tick={{ fill: "#d1d5db" }}
                  label={{
                    value: "Kenaikan (mm)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#d1d5db",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) =>
                    [`${value.toFixed(2)} mm`, name]
                  }
                />

                <Legend />

                {/* 🔹 Tahunan */}
                <Line
                  type="monotone"
                  dataKey="kenaikan_tahunan_mm"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Kenaikan Tahunan (mm/tahun)"
                  isAnimationActive
                  animationDuration={1600}
                  animationEasing="ease-out"
                />

                {/* 🔹 Kumulatif */}
                <Line
                  type="monotone"
                  dataKey="kenaikan_kumulatif_mm"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Kenaikan Kumulatif (mm)"
                  isAnimationActive
                  animationDuration={2200}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          <p className="text-sm text-gray-400 text-center mt-4">
            *Data hasil prediksi Hybrid STL–LSTM berbasis SLA harian (1993–2024)
          </p>
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-80 bg-gray-800 rounded-2xl shadow-lg p-5 space-y-4"
        >
          <h4 className="text-lg font-semibold">Panel Informasi</h4>

          <div className="text-sm space-y-2">
            <p><strong>📍 Lokasi:</strong> Pesisir Kabupaten Jember</p>
            <p><strong>📆 Periode:</strong> 2025–2050</p>
            <p>
              <strong>🤖 Model:</strong> Hybrid STL (Trend + Seasonal) & LSTM (Residual)
            </p>
            <p>
              <strong>🗺️ Integrasi:</strong> DEMNAS + GIS-based Bathtub Inundation
            </p>
          </div>

          <div className="border-t border-gray-700" />

          <div className="text-xs text-gray-400 leading-relaxed">
            Grafik menunjukkan perbedaan antara laju kenaikan tahunan
            dan akumulasi kenaikan muka air laut yang digunakan sebagai
            dasar analisis spasial genangan wilayah pesisir.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Visualization;
