import React, { useState } from 'react';
import './App.css';
import TopAnimeStats from './components/TopAnimeStats'; // <-- Proper import
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

        {/* Correct TopAnimeStats (dynamic based on selectedState) */}
        <TopAnimeStats selectedState={selectedState} />

        {/* MAP SECTION */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ textAlign: 'center' }}>USA Heatmap</h3>
          <Map 
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setAllStates={setAllStates}
          />
        </div>

        <h4 style={{ textAlign: 'center' }}>
          Showing stats for: <strong>{selectedState}</strong>
        </h4>

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
