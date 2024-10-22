import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [forecast, setForecast] = useState({});
  const [issue, setIssue] = useState(false);
  const [days, setDays] = useState(16);
  const [meanhigh, setMeanhigh] = useState(0);
  const [meanlow, setMeanlow] = useState(0);

  const grabWeather = async () => {
    setIssue(false);
    try {
      const location = `${city},${state}`;
      const Forecast = {};
      if (days == 0){
        setDays(16)
      }

      await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&days=${days}&units=I&key=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
          data.data.forEach((entry) => {
            const date = entry.valid_date;
            Forecast[date] = [entry.high_temp, entry.low_temp, entry.weather];
          });
        });
      setForecast(Forecast);
    } catch {
      setIssue(true);
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${month}/${day}`;
  };

  useEffect(() => {
    if (forecast) {
      let high = 0, low = 0;
      Object.keys(forecast).forEach((entry) => {
        high += forecast[entry][0];
        low += forecast[entry][1];
      });
      setMeanhigh(high/days)
      setMeanlow(low/days)
    }
  }, [forecast]);

  return (
    <div className="app-container">
      <div className="weather-wrapper">
        <div className="weather-box">
          <h3>Type the city, state, and number of days to get your weather forecast. limited to 16 days max!</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              className ="days"
              type="text"
              placeholder="days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
            <button onClick={grabWeather}>Search</button>
          </div>
          {issue && <p className="error-message">City Not Found! Make sure it is typed correctly.</p>}
        </div>
        {Object.keys(forecast).length > 0 && 
          <div className="mean-container">
            <h3>Total days: {Object.keys(forecast).length}</h3>
            <p>Mean High Temperature: {meanhigh}°F</p>
            <p>Mean Low Temperature: {meanlow}°F</p>
          </div>
        }
        <div className="forecast-container">
          {Object.keys(forecast).map((date) =>
            date !== 'current' ? (
              <div key={date} className="forecast-item">
                <h4>{formatDate(date)}</h4>
                <img
                  src={`/icons.tar/icons/${forecast[date][2].icon}.png`}
                  alt={forecast[date][2].description}
                />
                <p>{`High: ${forecast[date][0]}°F`}</p>
                <p>{`Low: ${forecast[date][1]}°F`}</p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
