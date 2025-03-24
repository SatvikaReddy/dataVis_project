import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./AnimeBarChart.css";

const chartData = {
  Japan: [
    { source: "Manga", count: 120 },
    { source: "Original", count: 80 },
  ],
  USA: [
    { source: "Manga", count: 40 },
    { source: "Original", count: 150 },
  ],
  Korea: [
    { source: "Manga", count: 60 },
    { source: "Original", count: 90 },
  ],
};

const AnimeBarChart = () => {
  const [selectedCountry, setSelectedCountry] = useState("Japan");

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">Anime Count by Source</h2>

      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label htmlFor="country-select" style={{ marginRight: "8px" }}>Country:</label>
        <select id="country-select" value={selectedCountry} onChange={handleCountryChange}>
          {Object.keys(chartData).map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            data={chartData[selectedCountry]}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[5, 5, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>

    </div>
  );
};

export default AnimeBarChart;