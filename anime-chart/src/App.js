
import React from 'react';
import './App.css';
import AnimeBarChart from './components/AnimeBarChart';
import GenderRadarChart from './components/GenderRadarChart';
import AnimeBubbleChart from './components/AnimeBubbleChart';

function App() {
  return (
    <div className="App">
      <div className="top-row">
        <AnimeBarChart />
        <GenderRadarChart />
      </div>
      <div className="bottom-row">
        <AnimeBubbleChart />
      </div>
    </div>
  );
}

export default App;
