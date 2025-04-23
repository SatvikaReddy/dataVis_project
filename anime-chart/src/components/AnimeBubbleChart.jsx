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

        const colors = ['rgba(120, 120, 255, 0.6)', 'rgba(100, 255, 100, 0.6)', 'rgba(255, 180, 50, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(0, 200, 255, 0.6)'];

        const datasets = genreList.slice(0, 6).map((genre, idx) => {
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
            backgroundColor: colors[idx % colors.length]
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
        <div style={{ height: '520px' }}>
          <Bubble
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: { display: true, text: 'Genre Index' },
                  ticks: { callback: () => '' }
                },
                y: {
                  type: 'category',
                  labels: ageGroups,
                  title: { display: true, text: 'Age Group' },
                  ticks: {
                    font: { size: 14 },
                    color: '#444'
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    padding: 10
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const genre = context.dataset.label || '';
                      const age = context.raw.y;
                      const count = context.raw.count;
                      return `${genre} | Age Group: ${age} | # of Viewers: ${count}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
};

export default AnimeBubbleChart;
