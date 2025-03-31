
import React, { useEffect, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Papa from "papaparse";

const GenderRadarChart = () => {
  const [data, setData] = useState({});
  const [country, setCountry] = useState("");

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + "/radar_chart_data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const grouped = {};
        results.data.forEach((row) => {
          const c = row.country;
          const g = row.gender;
          if (!grouped[c]) grouped[c] = [];
          grouped[c].push({
            status: "Completed", [g]: parseInt(row.Completed),
            Watching: parseInt(row.Watching),
            Rewatched: parseInt(row.Rewatched),
            Dropped: parseInt(row.Dropped),
          });
        });
        const structured = {};
        for (let c in grouped) {
          const genders = { Male: {}, Female: {} };
          grouped[c].forEach((entry) => {
            for (let key of ["Completed", "Watching", "Rewatched", "Dropped"]) {
              genders.Male[key] = entry["Male"] || 0;
              genders.Female[key] = entry["Female"] || 0;
            }
          });
          structured[c] = ["Completed", "Watching", "Rewatched", "Dropped"].map((status) => ({
            status,
            Male: genders.Male[status] || 0,
            Female: genders.Female[status] || 0
          }));
        }
        setData(structured);
        setCountry(Object.keys(structured)[0]);
      },
    });
  }, []);

  if (!data[country]) return <p>Loading Radar Chart...</p>;

  return (
    <div style={{ width: "400px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h3>Anime by Gender</h3>
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        {Object.keys(data).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data[country]}>
          <PolarGrid />
          <PolarAngleAxis dataKey="status" />
          <PolarRadiusAxis angle={30} domain={[0, 10000]} />
          <Tooltip />
          <Legend />
          <Radar name="Male" dataKey="Male" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Female" dataKey="Female" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderRadarChart;
