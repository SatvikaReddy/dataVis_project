import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./GenderRadarChart.css";

const countryData = {
  Japan: [
    { status: "Completed", Male: 90, Female: 80 },
    { status: "Watching", Male: 70, Female: 65 },
    { status: "Rewatched", Male: 40, Female: 45 },
    { status: "Dropped", Male: 20, Female: 30 },
  ],
  USA: [
    { status: "Completed", Male: 60, Female: 75 },
    { status: "Watching", Male: 50, Female: 55 },
    { status: "Rewatched", Male: 30, Female: 35 },
    { status: "Dropped", Male: 25, Female: 40 },
  ],
  Korea: [
    { status: "Completed", Male: 80, Female: 90 },
    { status: "Watching", Male: 60, Female: 70 },
    { status: "Rewatched", Male: 35, Female: 50 },
    { status: "Dropped", Male: 15, Female: 25 },
  ],
};

const GenderRadarChart = () => {
  const [country, setCountry] = useState("Japan");

  return (
    <div className="radar-container">
      <h2>Anime Consumption by Gender</h2>
      <div className="dropdown-wrapper">
        <label htmlFor="country-select">Country:</label>
        <select
          id="country-select"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {Object.keys(countryData).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={countryData[country]}>
          <PolarGrid />
          <PolarAngleAxis dataKey="status" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Radar
            name="Male"
            dataKey="Male"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Female"
            dataKey="Female"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderRadarChart;
