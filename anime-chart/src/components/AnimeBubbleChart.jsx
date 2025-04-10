import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AnimeBubbleChart.css";

const genres = ["Action", "Drama", "Comedy", "Romance", "Fantasy"];
const ageBins = ["<13", "13-17", "18-25", "26-35", "36+"];

// Map genre and age bin labels to numbers
const genreMap = Object.fromEntries(genres.map((g, i) => [g, i + 1]));
const ageMap = Object.fromEntries(ageBins.map((a, i) => [a, i + 1]));

// Sample dataset
const data = [
  { genre: "Action", age: "13-17", popularity: 30, producer: "A" },
  { genre: "Drama", age: "18-25", popularity: 70, producer: "B" },
  { genre: "Comedy", age: "13-17", popularity: 60, producer: "C" },
  { genre: "Romance", age: "18-25", popularity: 50, producer: "B" },
  { genre: "Fantasy", age: "26-35", popularity: 80, producer: "A" },
  { genre: "Action", age: "36+", popularity: 40, producer: "C" },
];

const colorMap = {
  A: "#8884d8",
  B: "#82ca9d",
  C: "#ffc658",
};

const AnimeBubbleChart = () => {
  return (
    <div className="bubble-container">
      <h2>Anime Popularity by Genre, Age Group & Producer</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name="Genre"
            tickFormatter={(tick) => genres[tick - 1]}
            domain={[1, genres.length]}
            allowDecimals={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Age Group"
            tickFormatter={(tick) => ageBins[tick - 1]}
            domain={[1, ageBins.length]}
            allowDecimals={false}
          />
          <ZAxis type="number" dataKey="z" range={[40, 1000]} name="Popularity" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
              if (name === "x") return [genres[value - 1], "Genre"];
              if (name === "y") return [ageBins[value - 1], "Age Group"];
              return [value, name];
            }}
          />
          <Legend />

          {/* Render one Scatter per producer */}
          {Object.keys(colorMap).map((producerKey) => (
            <Scatter
              key={producerKey}
              name={`Producer ${producerKey}`}
              data={data
                .filter((d) => d.producer === producerKey)
                .map((d) => ({ x: genreMap[d.genre], y: ageMap[d.age], z: d.popularity }))}
              fill={colorMap[producerKey]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimeBubbleChart;
