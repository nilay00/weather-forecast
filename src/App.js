import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import img1 from "./assets/humidity.png";
import img2 from "./assets/windy.png";
import img3 from "./assets/witness.png";
import smoke from "./assets/clouds.png";
import overcastClouds from "./assets/cloudy.png";
import lrain from "./assets/light-rain.png";
import sunny from "./assets/sun.png";
function App() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [city, setCity] = useState('');
  const [coordLon, setCoordLon] = useState('');
  const [coordLat, setCoordLat] = useState('');
  const [weatherDetails, setWeatherDetails] = useState('');
  let [weatherDesc, setWeatherDesc] = useState('');
  const [mainData, setMainData] = useState('');
  const [windData, setWindData] = useState('');

  const inputEvent = (e) => {
    setSearchValue(e.target.value);
  };

  const calculateTem = (temp) => {
    let temInDegCel = temp - 273.15;
    return temInDegCel.toFixed(2);
  };

  const calculateVisibility = (visibility) => {
    const visibilityInKilometers = visibility / 1000;
    return visibilityInKilometers;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(searchValue);
  };

  const getWeatherDetails = async (coordLon, coordLat) => {
    try {
      setLoading(true);
      const getDetails = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordLat}&lon=${coordLon}&appid=a106115486d519fa36416cddd6891ffc`);
      setWeatherDetails(getDetails.data);
      setMainData(getDetails.data.main);
      setWindData(getDetails.data.wind);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherDetails(coordLon, coordLat);
  }, [coordLon, coordLat]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordLat(latitude);
          setCoordLon(longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(false)
    getCurrentLocation();
  }, []);

  const details = async () => {
    try {
      setLoading(true);
      const getDetails = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchValue ?? ''}&appid=a106115486d519fa36416cddd6891ffc`);
      setCoordLon(getDetails.data.coord.lon);
      setCoordLat(getDetails.data.coord.lat);
      setWeatherDetails(getDetails.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      details();
    }
  }, [city]);

  useEffect(() => {
    if (weatherDetails) {
      setWeatherDesc(weatherDetails.weather[0].description);
    }
  }, [weatherDetails]);

  return (
    <div className="App">
      <div className="main-section">
        <div className="main-details-section">
          {(!coordLat || !coordLon) ? (
            "Please Allow Location For the Current Location"
          ) : (
            <div className="main">
              <form className="search-bar" onSubmit={handleSubmit}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search"
                  name="cityName"
                  onChange={inputEvent}
                  value={searchValue}
                />
                <i className="fas fa-search" aria-hidden="true" onClick={handleSubmit}></i>
              </form>
              <div className="body-container">
                <div className="left-body">
                  {weatherDesc === "smoke" ? (
                    <img src={smoke} alt="" />
                  ) : weatherDesc === "overcast clouds" ? (
                    <img src={overcastClouds} alt="" />
                  ) : weatherDesc === "light rain" ? (
                    <img src={lrain} alt="" />
                  ) : (
                    <img src={sunny} alt="" />
                  )}
                </div>
                <div className="Right-body">
                  <h1>{weatherDetails.name}</h1>
                  <h5>{weatherDesc}</h5>
                  <p>{mainData.temp ? calculateTem(mainData.temp) + "°C" : ""}</p>
                  <p>{mainData.temp ? "Maximum Temp " + calculateTem(mainData.temp_max) + "°C - Minimum Temp " + calculateTem(mainData.temp_min) + "°C" : ""}</p>
                </div>
              </div>
              <div className="card">
                <div className="card-item">
                  <p>Humidity</p>
                  <img src={img1} alt="" />
                  <h3>{mainData.humidity}%</h3>
                </div>
                <div className="card-item">
                  <p>Visibility</p>
                  <img src={img3} alt="" />
                  <h3>{weatherDetails.visibility ? calculateVisibility(weatherDetails.visibility) : ""}km</h3>
                </div>
                <div className="card-item">
                  <p>Wind</p>
                  <img src={img2} alt="" />
                  <h3>{windData.speed}km/h</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;