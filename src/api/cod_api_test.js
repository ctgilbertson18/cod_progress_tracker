import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import LineChart from './components/LineChart';
import { fetchData } from './utils/fetchData';
import './App.css';

function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [filters, setFilters] = useState({
    Player_Name: [],
    Location_Name: '',
    Skin_Id: '',
    Loadout_Id: '',
    StartDate: '',
    EndDate: new Date().toISOString().split('T')[0],
    Map_Name: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    Player_Name: [],
    Location_Name: [],
    Skin_Id: [],
    Loadout_Id: [],
    Map_Name: []
  });

  const [yAxisMetric, setYAxisMetric] = useState('Kills');
  const [averages, setAverages] = useState({});
  const [yAxisOptions] = useState(['Kills', 'Damage', 'Score', 'Place', 'perceived_fun']);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const allData = await fetchData({});
        const playerNames = [...new Set(allData.map(item => item.Player_Name))];
        const locationNames = [...new Set(allData.map(item => item.Location_Name))];
        const skinIds = [...new Set(allData.map(item => item.Skin_Id))];
        const loadoutIds = [...new Set(allData.map(item => item.Loadout_Id))];
        const mapNames = [...new Set(allData.map(item => item.Map_Name))];

        setFilterOptions({
          Player_Name: playerNames,
          Location_Name: locationNames,
          Skin_Id: skinIds,
          Loadout_Id: loadoutIds,
          Map_Name: mapNames
        });

        updateChartData(allData);
        calculateAverages(allData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchDataWithFilters = async () => {
      try {
        const data = await fetchData(filters);
        updateChartData(data);
        calculateAverages(data);
      } catch (error) {
        console.error('Error fetching data with filters:', error);
      }
    };

    fetchDataWithFilters();
  }, [filters, yAxisMetric]);

  const updateChartData = (data) => {
    const playerNames = [...new Set(data.map(item => item.Player_Name))];
    const allGameIds = [...new Set(data.map(item => item.Game_Id))];
    const datasets = playerNames.map(player => {
      const playerData = data.filter(item => item.Player_Name === player);
      const metricData = allGameIds.map(gameId => {
        const gameData = playerData.find(item => item.Game_Id === gameId);
        return gameData ? gameData[yAxisMetric] : null;
      });
      return {
        label: `Player ${player}`,
        data: metricData,
        borderColor: getRandomColor(),
        backgroundColor: 'transparent',
        fill: false
      };
    });

    setChartData({
      labels: allGameIds,
      datasets: datasets
    });
  };

  const calculateAverages = (data) => {
    const playerNames = [...new Set(data.map(item => item.Player_Name))];
    const calculatedAverages = {};
    playerNames.forEach(player => {
      yAxisOptions.forEach(metric => {
        const playerData = data.filter(item => item.Player_Name === player);
        const sum = playerData.reduce((total, item) => total + item[metric], 0);
        const average = sum / playerData.length;
        if (!calculatedAverages[metric]) {
          calculatedAverages[metric] = {};
        }
        calculatedAverages[metric][player] = average;
      });
    });
    setAverages(calculatedAverages);
  };

  const handleFilterChange = (selectedOptions, actionMeta) => {
    if (!actionMeta) {
      return;
    }
  
    if (actionMeta.name === 'Player_Name') {
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setFilters(prevFilters => ({
        ...prevFilters,
        Player_Name: selectedValues
      }));
    } else if (actionMeta.target) {
      const { name, value } = actionMeta.target;
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
      }));
    }
  };
  
  const handleMetricChange = (e) => {
    setYAxisMetric(e.target.value);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const playerOptions = (filterOptions.Player_Name || []).map(option => ({ value: option, label: option }));
  const mapNameOptions = (filterOptions.Map_Name || []).map(option => ({ value: option, label: option }));

  return (
    <div className="app">
      <h1>Call of Duty Tracker</h1>
      <div className="filter-container">
        <div className="filter-group">
          <label>
            Player Name:
            <Select
              isMulti
              name="Player_Name"
              options={playerOptions}
              className="custom-select"
              classNamePrefix="custom-select"
              value={playerOptions.filter(option => filters.Player_Name.includes(option.value))}
              onChange={handleFilterChange}
              components={{
                MultiValueLabel: ({ children, ...props }) => (
                  <div className="select__multi-value" {...props}>
                    {children}
                  </div>
                ),
              }}
            />
          </label>
          <label>
            Y-Axis Metric:
            <select value={yAxisMetric} onChange={handleMetricChange}>
              {yAxisOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-group">
          {['Location_Name', 'Skin_Id', 'Loadout_Id', 'Map_Name'].map(key => (
            <label key={key}>
              {key}:
              <select name={key} value={filters[key]} onChange={e => handleFilterChange(null, e)}>
                <option value="">All</option>
                {filterOptions[key] && filterOptions[key].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <label>
            Start Date:
            <input type="date" name="StartDate" value={filters.StartDate} onChange={e => handleFilterChange(null, e)} />
          </label>
          <label>
            End Date:
            <input type="date" name="EndDate" value={filters.EndDate} onChange={e => handleFilterChange(null, e)} />
          </label>
        </div>
      </div>
      <div className="chart-container">
        <LineChart chartData={chartData} yAxisMetric={yAxisMetric} />
      </div>
      <div className="averages-container">
        <h2>Player Averages</h2>
        <div className="averages-grid">
          {Object.keys(averages).map((metric) => (
            <div key={metric} className="metric-averages">
              <h3>{metric}</h3>
              <ul>
                {Object.entries(averages[metric])
                  .sort(([playerA, avgA], [playerB, avgB]) => {
                    if (metric === 'Place') {
                      return avgA - avgB;
                    }
                    return avgB - avgA;
                  })
                  .map(([player, average]) => (
                    <li key={player}>
                      Player {player}: {average.toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
