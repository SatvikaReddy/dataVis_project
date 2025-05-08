import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
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
    Papa.parse(process.env.PUBLIC_URL + '/cleaned_usa_data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const allData = results.data;
        const uniqueCountries = [...new Set(allData.map(row => row.state).filter(Boolean))];
        setAllStates(uniqueCountries);

        const filtered = allData.filter(row => row.state === selectedState);
        const bubbleMap = {};

        filtered.forEach(row => {
          const ageGroup = getAgeGroup(row.Age);
          if (!ageGroup || !row.genre) return;

          const genres = row.genre.split(',').map(g => g.trim());
          genres.forEach(genre => {
            const key = genre + '-' + ageGroup;
            bubbleMap[key] = (bubbleMap[key] || 0) + 1;
          });
        });

        const genreList = [...new Set(Object.keys(bubbleMap).map(k => k.split('-')[0]))];

        const brightColors = [
          'rgba(0, 153, 255, 0.9)',     // Blue
          'rgba(255, 140, 0, 0.9)',     // Orange
          'rgba(0, 255, 127, 0.9)',     // Green
          'rgba(255, 69, 69, 0.9)',     // Red
          'rgba(186, 85, 211, 0.9)',    // Purple
          'rgba(255, 215, 0, 0.9)',     // Gold
          'rgba(255, 105, 180, 0.9)',   // Pink
          'rgba(127, 255, 212, 0.9)',   // Aqua
          'rgba(255, 255, 100, 0.9)',   // Pale Yellow
          'rgba(255, 255, 255, 0.9)'    // White
        ];

        const genreColorMap = {};
        genreList.forEach((genre, idx) => {
          genreColorMap[genre] = brightColors[idx % brightColors.length];
        });

        const datasets = genreList.slice(0, 6).map((genre) => {
          const data = Object.keys(bubbleMap)
            .filter(k => k.startsWith(genre + '-'))
            .map(k => {
              const [, ageGroup] = k.split('-');
              return {
                x: genreList.indexOf(genre),
                y: ageGroup,
                r: Math.min(bubbleMap[k] / 50 + 5, 30),
                count: bubbleMap[k]
              };
            });
          return {
            label: genre,
            data,
            backgroundColor: genreColorMap[genre]
          };
        });

        if (datasets.length === 0) {
          setNoData(true);
        }

        setData({ datasets });
      }
    });
  }, [selectedState, setAllStates]);

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
                      color: '#ffffff',
                      font: { size: 12 }
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
                        const age = context.raw.y;
                        const count = context.raw.count.toLocaleString();
                        return `${genre} | Age Group: ${age} | # of Viewers: ${count}`;
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
