"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ISSData {
  id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<ISSData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchISSData = async () => {
      try {
        const res = await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
        const date = new Date();
        const newData: ISSData = {
          id: crypto.randomUUID(),
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          altitude: res.data.altitude,
          velocity: res.data.velocity,
          timestamp: date.toLocaleTimeString(),
        };
        setHistory((prev) => [...prev, newData]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchISSData();
    const interval = setInterval(fetchISSData, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = history.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(history.length / recordsPerPage) || 1;

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Live ISS Telemetry
        </h1>
        <div className="flex gap-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 font-medium transition-colors"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Latitude</th>
                <th className="p-4 font-semibold">Longitude</th>
                <th className="p-4 font-semibold">Altitude (km)</th>
                <th className="p-4 font-semibold">Velocity (km/h)</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="p-4">{record.timestamp}</td>
                  <td className="p-4">{record.latitude.toFixed(4)}</td>
                  <td className="p-4">{record.longitude.toFixed(4)}</td>
                  <td className="p-4">{record.altitude.toFixed(2)}</td>
                  <td className="p-4">{record.velocity.toFixed(2)}</td>
                </tr>
              ))}
              {currentRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Establishing connection to ISS...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 flex justify-between items-center border-t dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages} | Total Records: {history.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
