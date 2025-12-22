import React from "react";
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

const Visualization: React.FC = () => {
    // Data dummy realistis berdasarkan tren IPCC (kenaikan rata-rata global)
    const data = Array.from({ length: 26 }, (_, i) => {
        const tahun = 2025 + i;
        const kenaikanTahunan = 0.3 + i * 0.05; // semakin meningkat tiap tahun
        const kenaikanTotal = 0 + kenaikanTahunan + i * 0.35; // kumulatif
        return {
            tahun,
            kenaikanTahunan: parseFloat(kenaikanTahunan.toFixed(2)),
            kenaikanTotal: parseFloat(kenaikanTotal.toFixed(2)),
        };
    });

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
            {/* 🔹 Navbar mirip halaman GIS */}
            <div className="p-3 bg-gray-800 flex gap-4 items-center shadow-md">
                <h2 className="text-md max-w-3xl break-words">
                    Sistem Prediksi Kenaikan Muka Air Laut dengan Pendekatan Seasonal-Trend Decomposition Using LOESS di Pesisir Kabupaten Jember
                </h2>
                <div className="ml-auto flex gap-6 items-center text-sm">
                    <a href="/gis-map" className="hover:text-cyan-400 transition">
                        🌍 Peta GIS
                    </a>
                    <a href="/visualization" className="text-cyan-400 font-medium">
                        📈 Visualisasi
                    </a>
                    <a href="/" className="hover:text-cyan-400 transition">
                        🏠 Beranda
                    </a>
                </div>
            </div>

            {/* 🔹 Konten Utama */}
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
                {/* Grafik */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-semibold mb-4 text-center">
                        Proyeksi Kenaikan Muka Air Laut Wilayah Pesisir Kabupaten Jember
                    </h3>

                    <ResponsiveContainer width="100%" height={420}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis
                                dataKey="tahun"
                                stroke="#ccc"
                                tick={{ fill: "#ccc" }}
                                tickMargin={8}
                            />
                            <YAxis
                                stroke="#ccc"
                                tick={{ fill: "#ccc" }}
                                label={{
                                    value: "Kenaikan (cm)",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: "#ccc",
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "none",
                                    color: "#fff",
                                }}
                                formatter={(value: number, name: string) =>
                                    name === "kenaikanTotal"
                                        ? [`${value} cm`, "Kenaikan Kumulatif"]
                                        : [`${value} cm/tahun`, "Kenaikan Tahunan"]
                                }
                            />
                            <Legend wrapperStyle={{ color: "#ddd" }} />
                            <Line
                                type="monotone"
                                dataKey="kenaikanTahunan"
                                stroke="#22d3ee"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: "#22d3ee" }}
                                name="Kenaikan Tahunan"
                            />
                            <Line
                                type="monotone"
                                dataKey="kenaikanTotal"
                                stroke="#38bdf8"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#38bdf8" }}
                                activeDot={{ r: 6, fill: "#0ea5e9" }}
                                name="Kenaikan Kumulatif"
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <p className="text-sm text-gray-400 text-center mt-4">
                        *Data bersifat simulasi (dummy) berdasarkan tren emisi moderat (SSP2-4.5)
                    </p>
                </motion.div>

                {/* Panel Informasi / Legenda */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:w-80 bg-gray-800 rounded-2xl shadow-lg p-5 space-y-4"
                >
                    <h4 className="text-lg font-semibold mb-2">Panel Informasi</h4>

                    <div className="text-sm space-y-2">
                        <p>
                            <strong>📍 Lokasi Fokus:</strong> Wilayah pesisir Kabupaten
                            Jember, Jawa Timur, Indonesia.
                        </p>
                        <p>
                            <strong>📆 Periode:</strong> Tahun 2025–2050 (proyeksi selama 26 tahun)
                        </p>
                        <p>
                            <strong>🌊 Interpretasi:</strong> Garis{" "}
                            <span className="text-cyan-400 font-medium">biru muda</span>{" "}
                            menunjukkan kenaikan kumulatif, sedangkan garis{" "}
                            <span className="text-teal-300 font-medium">biru kehijauan</span>{" "}
                            menunjukkan kenaikan tiap tahun.
                        </p>
                        <p>
                            <strong>🤖 Model Prediksi:</strong> Model deep learning hybrid
                            menggunakan metode STL Decomposition dan LSTM berdasarkan data 30
                            tahun terakhir.
                        </p>
                    </div>

                    <div className="border-t border-gray-700 my-3" />

                    <div className="text-sm text-gray-400">
                        <strong>Legenda:</strong>
                        <ul className="mt-2 space-y-1">
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-[2px] bg-teal-400"></div>
                                Kenaikan Tahunan (cm/tahun)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-[2px] bg-sky-400"></div>
                                Kenaikan Kumulatif (cm)
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-700 my-3" />

                    <div className="text-xs text-gray-500 leading-relaxed">
                        Catatan: Proyeksi ini merupakan hasil simulasi model. Nilai sebenarnya
                        dapat berbeda tergantung pada perubahan iklim global, laju emisi gas
                        rumah kaca, dan faktor oseanografi regional.
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Visualization;
