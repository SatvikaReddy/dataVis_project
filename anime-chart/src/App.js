
import React from "react";
import "./App.css";
import AnimeBarChart from "./components/AnimeBarChart";
import AnimeBubbleChart from "./components/AnimeBubbleChart";
import GenderRadarChart from "./components/GenderRadarChart";

function App() {
  return (
    <div className="App">
      <h1>Anime Dashboard</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "center" }}>
        <AnimeBarChart />
        <GenderRadarChart />
        <AnimeBubbleChart />
      </div>
    </div>
  );
}

export default App;
