import React, { useState } from 'react';
import './App.css';
import './Navbar.css';

import TopAnimeStats from './components/TopAnimeStats';
import AnimeBarChart from './components/AnimeBarChart';
import GenderRadarChart from './components/GenderRadarChart';
import AnimeBubbleChart from './components/AnimeBubbleChart';
import Map from './components/Map';

const Navbar = ({ selectedState, setSelectedState, allStates }) => {
  return (
    <header className="navbar-banner">
      <div className="navbar-title-section">
        <h1 className="navbar-title">AnimeData</h1>
      </div>

      <div className="navbar-spacer" />
      <nav className="navbar-links">
        <div className="dropdown">
          <button className="dropbtn">Stats ▼</button>
          <div className="dropdown-content">
            <a href="#bar">Popularity</a>
            <a href="#radar">Gender Stats</a>
            <a href="#bubble">Rating vs Episodes</a>
          </div>
        </div>
        <a
          href="/Exploring.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '13px' }}
        >
          Process Book
        </a>
        <div className="state-selector">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {allStates.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </nav>
    </header>
  );
};

function App() {
  const [selectedState, setSelectedState] = useState('Michigan');
  const [allStates, setAllStates] = useState([]);

  return (
    <div>
      <Navbar
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        allStates={allStates}
      />

      <div className="main-content">
        <TopAnimeStats selectedState={selectedState} />

        <div className="map-section">
          <h3>USA Heatmap</h3>
          <Map 
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setAllStates={setAllStates}
          />
        </div>

        <h4 className="state-display">
          Showing stats for: <strong>{selectedState}</strong>
        </h4>

        <div className="charts-row">
          <div id="bar" className="chart-wrapper">
            <AnimeBarChart selectedState={selectedState} setAllStates={setAllStates}/>
          </div>
          <div id="radar" className="chart-wrapper">
            <GenderRadarChart selectedState={selectedState} setAllStates={setAllStates}/>
          </div>
        </div>

        <div id="bubble" className="bubble-wrapper">
          <AnimeBubbleChart selectedState={selectedState} setAllStates={setAllStates}/>
        </div>
      </div>
    </div>
  );
}

export default App;
