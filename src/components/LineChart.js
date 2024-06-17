import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

function LineChart({ chartData, yAxisMetric }) {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Player Stats',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Game ID',
          },
        },
        y: {
          title: {
            display: true,
            text: yAxisMetric,
          },
          type: 'linear', // Use linear scale for numeric values
        },
      },
    };

    setOptions(defaultOptions);
  }, [yAxisMetric]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {options && <Line ref={chartRef} data={chartData} options={options} />}
    </div>
  );
}

export default LineChart;
