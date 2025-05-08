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

const AnimeBarChart = ({ selectedState, setAllStates }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + '/cleaned_usa_data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const allData = results.data;

        // Set state list (only once across app)
        const countryList = [...new Set(allData.map(row => row.state).filter(Boolean))];
        setAllStates(countryList);

        // Filter data based on selected state
        const filtered = allData.filter(row => row.state === selectedState);
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
  }, [selectedState, setAllStates]);

  return (
    <div className="chart-container">
      <h3>Anime Count by Source</h3>
      {chartData ? <Bar data={chartData} /> : <p>Loading...</p>}
    </div>
  );
};

export default AnimeBarChart;
