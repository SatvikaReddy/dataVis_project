import React, { useState } from 'react';
import './App.css';
import AnimeBarChart from './components/AnimeBarChart';
import GenderRadarChart from './components/GenderRadarChart';
import AnimeBubbleChart from './components/AnimeBubbleChart';
import Map from './components/Map';
import "./Navbar.css";

// Navbar remains the same
const Navbar = () => {
  return (
    <header className="navbar-banner">
      <div className="navbar-title-section">
        <h1 className="navbar-title">AnimeData</h1>
      </div>
      <nav className="navbar-links">
        <a href="#bar">Popularity</a>
        <a href="#radar">Gender Stats</a>
        <a href="#bubble">Rating vs Episodes</a>
        <a href="/Exploring.pdf" target="_blank" rel="noopener noreferrer">Process Book</a>
      </nav>
    </header>
  );
};

// Stats panel remains the same
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

// MAIN APP COMPONENT
function App() {
  const [selectedState, setSelectedState] = useState('Michigan');
  const [allStates, setAllStates] = useState([]); // shared state list

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        {/* SHARED STATE SELECTOR */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <label>
            Select State:&nbsp;
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {allStates.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <TopAnimeStats />

        {/* MAP SECTION – added below trophies */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ textAlign: 'center' }}>USA Heatmap</h3>
          <Map 
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setAllStates={setAllStates}
          />
        </div>


        <h4 style={{ textAlign: 'center' }}>Showing stats for: <strong>{selectedState}</strong></h4>


        {/* Bar and Radar chart side-by-side */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "30px",
          marginBottom: "40px"
        }}>
          <div id="bar" style={{ flex: "1 1 45%", minWidth: "300px" }}>
            <AnimeBarChart selectedState={selectedState} setAllStates={setAllStates}/>
          </div>
          <div id="radar" style={{ flex: "1 1 45%", minWidth: "300px" }}>
            <GenderRadarChart
              selectedState={selectedState}
              setAllStates={setAllStates}
            />
          </div>
        </div>

        {/* Bubble chart full-width */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div id="bubble" style={{ flex: "1 1 60%", minWidth: "300px" }}>
            <AnimeBubbleChart selectedState={selectedState} setAllStates={setAllStates} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
