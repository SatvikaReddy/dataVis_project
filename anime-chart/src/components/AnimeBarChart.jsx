
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

const AnimeBarChart = () => {
  const [chartData, setChartData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + "/bar_chart_data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const grouped = {};
        results.data.forEach(row => {
          if (!grouped[row.country]) grouped[row.country] = [];
          grouped[row.country].push({ source: row.source, count: parseInt(row.count) });
        });
        setChartData(grouped);
        setSelectedCountry(Object.keys(grouped)[0]);
      },
    });
  }, []);

  if (!selectedCountry || !chartData[selectedCountry]) return <p>Loading Bar Chart...</p>;

  return (
    <div style={{ width: "400px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h3>Anime by Source</h3>
      <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
        {Object.keys(chartData).map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData[selectedCountry]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="source" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimeBarChart;
