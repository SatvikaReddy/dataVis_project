
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import './AnimeBarChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnimeBarChart = () => {
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
        const sourceCounts = {};
        filtered.forEach(row => {
          const source = row.source || 'Unknown';
          sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        const labels = Object.keys(sourceCounts);
        const values = Object.values(sourceCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Anime Count by Source',
              data: values,
              backgroundColor: 'rgba(100, 100, 255, 0.6)',
            }
          ]
        });
      }
    });
  }, [state]);

  return (
    <div className="chart-container">
      <h3>Anime Count by Source</h3>
      <label>
        State:
        <select value={state} onChange={(e) => setstate(e.target.value)}>
          {countries.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </label>
      {chartData ? <Bar data={chartData} /> : <p>Loading...</p>}
    </div>
  );
};

export default AnimeBarChart;
