import React from "react";
import "./App.css";
import AnimeBarChart from "./components/AnimeBarChart";
import GenderRadarChart from "./components/GenderRadarChart";
import AnimeBubbleChart from "./components/AnimeBubbleChart";


function App() {
  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <AnimeBarChart />
        </div>
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <GenderRadarChart />
        </div>
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
         <AnimeBubbleChart />
        </div>
      </div>
    </div>
  );
}

export default App;
