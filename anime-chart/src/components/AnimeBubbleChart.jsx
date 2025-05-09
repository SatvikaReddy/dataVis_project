import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  LinearScale
} from 'chart.js';
import './AnimeBubbleChart.css';

ChartJS.register(PointElement, Tooltip, Legend, Title, LinearScale);

const AnimeBubbleChart = ({ selectedState, setAllStates }) => {
  const [data, setData] = useState(null);
  const [rawBubbleData, setRawBubbleData] = useState([]);
  const [noData, setNoData] = useState(false);

  const ageGroups = ['35+', '32–35', '29–31', '26–28', '<26'];

  const getAgeGroup = (age) => {
    const a = parseInt(age);
    if (isNaN(a)) return null;
    if (a < 26) return '<26';
    if (a <= 28) return '26–28';
    if (a <= 31) return '29–31';
    if (a <= 35) return '32–35';
    return '35+';
  };

  useEffect(() => {
    const stateSet = new Set();
    Papa.parse(`${process.env.PUBLIC_URL}/cleaned_usa_data.csv`, {
      download: true,
      header: true,
      chunk: ({ data: rows }) => rows.forEach(r => r.state && stateSet.add(r.state)),
      complete: () => setAllStates(Array.from(stateSet).sort()),
      error: err => console.error('CSV state-load error:', err),
    });
  }, [setAllStates]);

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/bubble_chart_data.csv`, {
      download: true,
      header: true,
      complete: ({ data }) => setRawBubbleData(data),
      error: err => console.error('CSV bubble-data error:', err),
    });
  }, []);

  useEffect(() => {
    if (!rawBubbleData.length) return;

    const bubbleMap = {};
    rawBubbleData.forEach(r => {
      if (r.state !== selectedState) return;
      const ageGroup = getAgeGroup(r.Age);
      if (!ageGroup || !r.genre) return;
      r.genre.split(',').map(g => g.trim()).forEach(genre => {
        bubbleMap[`${genre}-${ageGroup}`] = (bubbleMap[`${genre}-${ageGroup}`] || 0) + 1;
      });
    });

    const entries = Object.entries(bubbleMap);
      if (!entries.length) {
        setNoData(true);
        setData(null);
        return;
      }

    const maxCount = Math.max(...entries.map(([, count]) => count));


    const genreList = [...new Set(Object.keys(bubbleMap).map(k => k.split('-')[0]))];

    const brightColors = [
      'rgba(0, 191, 255, 0.9)',     // Deep Sky Blue
      'rgba(255, 99, 71, 0.9)',     // Tomato Red
      'rgba(0, 255, 127, 0.9)',     // Spring Green
      'rgba(218, 112, 214, 0.9)',   // Orchid Purple
      'rgba(255, 215, 0, 0.9)',     // Gold (kept for highlight)
      'rgba(255, 20, 147, 0.9)',    // Deep Pink
      'rgba(64, 224, 208, 0.9)',    // Turquoise
      'rgba(123, 104, 238, 0.9)',   // Medium Slate Blue
      'rgba(255, 165, 0, 0.9)',     // Orange (brighter)
      'rgba(173, 255, 47, 0.9)'     // Green Yellow
    ];
    

    
    // Assign remaining colors to unseen genres
    const genreColorMap = {};
    genreList.forEach((genre, idx) => {
      genreColorMap[genre] = brightColors[idx % brightColors.length];
    });

    const datasets = genreList.slice(0,6).map(genre => ({
      label: genre,
      data: entries
        .filter(([k]) => k.startsWith(`${genre}-`))
        .map(([k, count]) => {
          const age = k.split('-')[1];
          return { x: genreList.indexOf(genre), y: age, r: Math.min((count / maxCount) * 30 + 5, 40)};
        }),
      backgroundColor: genreColorMap[genre],
    }));

    setData({ datasets });
  }, [rawBubbleData, selectedState]);

  return (
    <div className="chart-container">
      <h3>Popularity of Anime Genres Across Age Groups</h3>
      {noData ? (
        <p>No data available to display this chart.</p>
      ) : data ? (
        <>
          <div style={{ height: '520px' }}>
            <Bubble
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Genre Index',
                      color: '#ffa500',
                      font: { size: 14 }
                    },
                    ticks: {
                      display: false
                    },
                    grid: {
                      color: '#ffa500'
                    }
                  },
                  y: {
                    type: 'category',
                    labels: ageGroups,
                    title: {
                      display: true,
                      text: 'Age Group',
                      color: '#ffa500',
                      font: { size: 14 }
                    },
                    ticks: {
                      color: '#ffffff',
                      font: { size: 14 }
                    },
                    grid: {
                      color: '#ffa500'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 10,
                      color: '#ffa500'
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const genre = context.dataset.label || '';
                        const age = context.raw?.y ?? 'Unknown';
                        const count = context.raw?.count;
                      
                        if (count !== undefined) {
                          return `${genre} | Age Group: ${age} | # of Viewers: ${count.toLocaleString()}`;
                        } else {
                          return `${genre} | Age Group: ${age}`;
                        }
                      }
                      
                    }
                  }
                }
              }}
            />
          </div>
          <div className="bubble-size-legend">
            <span style={{ color: '#ffa500', fontWeight: 'bold' }}>Popularity:</span>
            <div className="bubble-legend-scale">
              <div className="bubble-circle small">Low</div>
              <div className="bubble-circle medium">Medium</div>
              <div className="bubble-circle large">High</div>
            </div>
          </div>
        </>
      ) : <p>Loading...</p>}
    </div>
  );
};

export default AnimeBubbleChart;
