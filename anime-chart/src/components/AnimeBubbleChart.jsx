
import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Papa from "papaparse";

const genres = ["Action", "Drama", "Comedy", "Romance", "Fantasy", "Sci-Fi", "Horror"];
const ageBins = ["<13", "13-17", "18-25", "26-35", "36+"];

const genreMap = Object.fromEntries(genres.map((g, i) => [g, i + 1]));
const ageMap = Object.fromEntries(ageBins.map((a, i) => [a, i + 1]));

const colorMap = {
  Manga: "#8884d8",
  Original: "#82ca9d",
  Novel: "#ffc658",
  Game: "#d88484"
};

const AnimeBubbleChart = () => {
  const [dataByProducer, setDataByProducer] = useState({});

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + "/bubble_chart_data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const grouped = {};
        results.data.forEach((row) => {
          const genre = row.genre;
          const age = row.age_group;
          const pop = parseInt(row.popularity);
          const producer = row.producer;
          if (genre && age && !isNaN(pop)) {
            if (!grouped[producer]) grouped[producer] = [];
            grouped[producer].push({
              x: genreMap[genre] || 0,
              y: ageMap[age] || 0,
              z: pop,
            });
          }
        });
        setDataByProducer(grouped);
      },
    });
  }, []);

  return (
    <div style={{ width: "400px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h3>Genre x Age x Popularity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            tickFormatter={(tick) => genres[tick - 1]}
            name="Genre"
            domain={[1, genres.length]}
          />
          <YAxis
            type="number"
            dataKey="y"
            tickFormatter={(tick) => ageBins[tick - 1]}
            name="Age Group"
            domain={[1, ageBins.length]}
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} name="Popularity" />
          <Tooltip
            formatter={(value, name) => {
              if (name === "x") return [genres[value - 1], "Genre"];
              if (name === "y") return [ageBins[value - 1], "Age Group"];
              return [value, name];
            }}
          />
          <Legend />
          {Object.keys(dataByProducer).map((producer) => (
            <Scatter
              key={producer}
              name={producer}
              data={dataByProducer[producer]}
              fill={colorMap[producer] || "#ccc"}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimeBubbleChart;
