
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";


function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const API_KEY = "1634bb5372e4c0a612fe017f4cd3c347";

  useEffect(() => {
    const fetchForecastData = async () => {
      setIsLoading(true);
      setError(null);
      const url = `${API_URL}?q=${data.city}&appid=${API_KEY}&units=metric`;

      try {
        const response = await axios.get(url);
        const dailyData = response.data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecastData(dailyData);
      } catch (error) {
        setError("Error fetching forecast data.");
        console.log("Error fetching forecast data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data.city) {
      fetchForecastData();
      // console.log(data);
    }
  }, [data.city]);

  const formatDay = (timestamp) => {
    const options = { weekday: "short" };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    return currentDate;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToFahrenheit = (temp) => Math.round((temp * 9) / 5 + 32);

  const renderTemperature = (temperature) => {
    return isCelsius
      ? Math.round(temperature)
      : convertToFahrenheit(temperature);
  };

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <b><span>{data.country}</span></b>
        </h2>
        
      </div>
      <p className="weather-des"><b>{data.condition.description}</b></p>
      <div className="date">
        <b><span>{getCurrentDate()}</span></b>
      </div>

      <div className="temp">               

        {renderTemperature(data.temperature.current)}
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
      </div>

      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40" />
          <div>
            <p className="wind">{data.wind.speed} m/s</p>
            <p>Wind speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40" />
          <div>
            <p className="humidity">{data.temperature.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>

      <div className="forecast">

        {isLoading && <p>Loading forecast...</p>}
        {error && <p className="error-message">{error}</p>}


        {/* <div className="forecast-container">
          {forecastData.map((day, index) => (
            <div className="day" key={index}>
              <p className="day-name">{formatDay(day.dt)}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="day-icon"
              />
              <p className="day-temperature">
                {isCelsius
                  ? `${Math.round(day.main.temp_min)}° / ${Math.round(day.main.temp_max)}°`
                  : `${convertToFahrenheit(day.main.temp_min)}° / ${convertToFahrenheit(day.main.temp_max)}°`}
              </p>
            </div>
          ))}
        </div> */}

<div className="forecast-container">
          {forecastData &&
            forecastData.slice(0, 5).map((day,index) => (
              <div className="day" key={index}>
                <p className="day-name">{formatDay(day.dt)}</p>
                {`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png` && (
                  <img
                    className="day-icon"
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                )}
                <p className="day-temperature">
                  {Math.round(day.main.temp_min)}° /{" "}
                  <span>{Math.round(day.main.temp_max)}°</span>
                </p>
              </div>
            ))}
        </div>
        
      </div>
    </div>
  );
}

export default Forecast;