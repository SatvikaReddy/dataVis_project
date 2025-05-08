import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import './GenderRadarChart.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

const GenderRadarChart = ({ selectedState, setAllStates }) => {
// Use selectedState directly
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
        const stateSet = new Set();
        const genders = { Male: {}, Female: {} };
        const fields = ['Completed', 'Watching', 'Dropped', 'Rewatched'];
        fields.forEach(f => {
          genders.Male[f] = 0;
          genders.Female[f] = 0;
        });
    
        Papa.parse(`${process.env.PUBLIC_URL}/radar_data.csv`, {
          download: true,
          header: true,
          chunk: ({ data: rows }) => {
            rows.forEach(row => {
              if (row.state) stateSet.add(row.state);
              if (row.state !== selectedState) return;
    
              const g = row.Gender;
              if (!genders[g]) return;
              fields.forEach(f => {
                const v = parseFloat(row[f]) || 0;
                genders[g][f] += v;
              });
            });
          },
          complete: () => {
            setAllStates(Array.from(stateSet).sort());
            setChartData({
              labels: fields,
              datasets: [
                {
                  label: 'Male',
                  data: fields.map(f => genders.Male[f]/1000),
                  backgroundColor: 'rgba(120,120,255,0.2)',
                  borderColor: 'rgba(100,100,255,1)',
                  borderWidth: 1,
                  pointBackgroundColor: 'rgba(80,80,255,1)',
                  pointRadius: 5
                },
                {
                  label: 'Female',
                  data: fields.map(f => genders.Female[f]/1000),
                  backgroundColor: 'rgba(0,200,100,0.2)',
                  borderColor: 'rgba(0,200,0,1)',
                  borderWidth: 1,
                  pointBackgroundColor: 'rgba(0,200,0,1)',
                  pointRadius: 5
                }
              ]
            });
          },
          error: err => console.error('CSV parse error:', err)
        });
      }, [selectedState, setAllStates]);
      
  return (
    <div className="chart-container radar-chart">
      <h3>Anime Consumption by Gender</h3>
      {chartData ? <Radar
    data={chartData}
    options={{
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.1,
      elements: {
        line: { borderWidth: 3 },
        point: { radius: 5 }
      },
      scales: {
        r: {
          angleLines: { color: '#eee' },
          grid: { color: '#ddd' },
          ticks: {
            callback: v => `${v}k`,
            backdropColor: 'transparent'
          },
          pointLabels: {
            font: { size: 14 }
          }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: function () {
              return '';  // ⛔️ Disable title
            },
            label: function (context) {
              const rawValue = context.raw * 1000;
              const label = context.dataset.label;
              const activity = context.label;
              return `${activity}: ${label} - ${rawValue.toLocaleString()} viewers`;
            }
          }
        }
      }
    }}
  />: <p>Loading...</p>}
    </div>
  );
};

export default GenderRadarChart;