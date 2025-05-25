

import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";

import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
    errorMessage: "",
  });

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "1634bb5372e4c0a612fe017f4cd3c347";

  const toDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday"
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const search = async (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      setWeather({ ...weather, loading: true, errorMessage: "" });
      const url = `${API_URL}?q=${query}&appid=${API_KEY}&units=metric`;

      try {
        const res = await axios.get(url);
        const weatherData = {
          city: res.data.name,
          country: res.data.sys.country,
          temperature: {
            current: res.data.main.temp,
            humidity: res.data.main.humidity,
          },
          condition: {
            description: res.data.weather[0].description,
            icon: res.data.weather[0].icon,
          },
          wind: {
            speed: res.data.wind.speed,
          },
        };
        setWeather({ data: weatherData, loading: false, error: false, errorMessage: "" });
      } catch (error) {
        let errorMessage = "Sorry, city not found. Please try again.";
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "Sorry, city not found. Please try again.";
          } else {
            errorMessage = "An error occurred while fetching weather data.";
          }
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = "An unexpected error occurred.";
        }
        setWeather({ ...weather, data: {}, error: true, errorMessage });
        console.log("Error fetching weather data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const defaultCity = "Pune";
      const url = `${API_URL}?q=${defaultCity}&appid=${API_KEY}&units=metric`;

      try {
        const res = await axios.get(url);
        const weatherData = {
          city: res.data.name,
          country: res.data.sys.country,
          temperature: {
            current: res.data.main.temp,
            humidity: res.data.main.humidity,
          },
          condition: {
            description: res.data.weather[0].description,
            icon: res.data.weather[0].icon,
          },
          wind: {
            speed: res.data.wind.speed,
          },
        };
        setWeather({ data: weatherData, loading: false, error: false, errorMessage: "" });
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true, errorMessage: "An error occurred while fetching weather data." });
        console.log("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      {weather.loading && (
        <>
          <br />
          <br />
          <h4>Searching..</h4>
        </>
      )}

      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              {weather.errorMessage}
            </span>
          </span>
        </>
      )}

      {weather && weather.data && weather.data.condition && (
        <Forecast weather={weather} toDate={toDate} />
      )}
    </div>
  );
}

export default App;