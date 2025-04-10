
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

const GenderRadarChart = () => {
  const [state, setstate] = useState('United States');
  const [chartData, setChartData] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + '/cleaned_usa_data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const allData = results.data;
        const countryList = [...new Set(allData.map(row => row.state).filter(Boolean))];
        setCountries(countryList);

        const filtered = allData.filter(row => row.state === state);
        const genders = { Male: {}, Female: {} };
        const fields = ['Completed', 'Watching', 'Dropped', 'Rewatched'];

        fields.forEach(field => {
          genders.Male[field] = 0;
          genders.Female[field] = 0;
        });

        filtered.forEach(row => {
          const g = row.Gender;
          if (genders[g]) {
            fields.forEach(field => {
              const value = parseFloat(row[field]) || 0;
              genders[g][field] += value;
            });
          }
        });

        setChartData({
          labels: fields,
          datasets: [
            {
              label: 'Male',
              data: fields.map(f => Math.round(genders.Male[f] / 1000)),
              backgroundColor: 'rgba(120,120,255,0.2)',
              borderColor: 'rgba(100,100,255,1)',
              borderWidth: 1,
              pointBackgroundColor: 'rgba(80,80,255,1)',
              pointRadius: 5
            },
            {
              label: 'Female',
              data: fields.map(f => Math.round(genders.Female[f] / 1000)),
              backgroundColor: 'rgba(0,200,100,0.2)',
              borderColor: 'rgba(0,200,0,1)',
              borderWidth: 1,
              pointBackgroundColor: 'rgba(0,200,0,1)',
              pointRadius: 5
            }
          ]
        });
      }
    });
  }, [state]);

  return (
    <div className="chart-container radar-chart">
      <h3>Anime Consumption by Gender</h3>
      <label>
        State:
        <select value={state} onChange={(e) => setstate(e.target.value)}>
          {countries.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </label>
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
                callback: (v) => `${v}k`,
                backdropColor: 'transparent'
              },
              pointLabels: {
                font: { size: 14 }
              }
            }
          },
          plugins: {
            legend: { position: 'top' }
          }
        }}
      /> : <p>Loading...</p>}
    </div>
  );
};

export default GenderRadarChart;
