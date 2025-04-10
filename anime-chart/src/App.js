import React from "react";
import "./App.css";
import AnimeBarChart from "./components/AnimeBarChart";
import GenderRadarChart from "./components/GenderRadarChart";
import AnimeBubbleChart from "./components/AnimeBubbleChart";

// Navbar component
const Navbar = () => {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 30px",
      backgroundColor: "#333",
      color: "white",
      marginBottom: "30px",
      borderRadius: "0 0 10px 10px"
    }}>
      <h2 style={{ margin: 0 }}>Anime Dataset Visualizations</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <a href="#bar" style={navLinkStyle}>Popularity</a>
        <a href="#radar" style={navLinkStyle}>Gender Stats</a>
        <a href="#bubble" style={navLinkStyle}>Rating vs Episodes</a>
      </div>
    </nav>
  );
};

// Navigation link styles
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px"
};

// Placeholder for top anime stats
const TopAnimeStats = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9"
    }}>
      <div style={{ textAlign: "center", minWidth: "120px" }}>
        <div style={{
          border: "2px dashed gray",
          borderRadius: "50%",
          padding: "20px",
          fontWeight: "bold"
        }}>
          #TOTAL<br />UNIQUE<br />ANIME
        </div>
      </div>
      <div style={{ flex: 1, padding: "0 20px" }}>
        <h3 style={{ textAlign: "center" }}>MOST POPULAR ANIMES</h3>
        {[1, 2, 3].map((rank) => (
          <div key={rank} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
            <span style={{ fontSize: "20px", marginRight: "10px" }}>🏆 #{rank}</span>
            <div style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#e0e0e0",
              border: "1px solid #aaa",
              marginRight: "10px"
            }}></div>
            <span>Anime Poster Thumbnail</span>
          </div>
        ))}
      </div>
      <div style={{ minWidth: "200px" }}>
        <h3 style={{ textAlign: "center" }}>BEST RATERS</h3>
        {[1, 2, 3].map((rank) => (
          <div key={rank} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
            <span style={{ fontSize: "20px", marginRight: "10px" }}>🏆 #{rank}</span>
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#d0d0d0",
              border: "1px solid #aaa"
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <TopAnimeStats />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "30px",
          }}
        >
          <div id="bar" style={{ flex: "1 1 30%", minWidth: "300px" }}>
            <AnimeBarChart />
          </div>
          <div id="radar" style={{ flex: "1 1 30%", minWidth: "300px" }}>
            <GenderRadarChart />
          </div>
          <div id="bubble" style={{ flex: "1 1 30%", minWidth: "300px" }}>
            <AnimeBubbleChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
