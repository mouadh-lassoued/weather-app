"use client";
import { useState } from "react";

type LocNames = {
  [key: string]: string | undefined;
  ascii?: string;
  feature_name?: string;
};

type GeoRes = {
  name: string;
  local_names?: LocNames;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type WeatherResponse = {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
  clouds: { all: number };
  dt: number;
  sys: { type?: number; id?: number; country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const apiKey = 'f9b95af02b9de2a067778edd6494eff3';
  const eventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  async function fetchWeatherData() {
    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
      const geoRes = await fetch(geoUrl);
      const cityData: GeoRes[] = await geoRes.json();

      if (cityData.length === 0) {
        console.error("City not found");
        return;
      }

      const { lat, lon } = cityData[0];
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const weatherRes = await fetch(weatherUrl);
      const weatherJson: WeatherResponse = await weatherRes.json();

      setWeatherData(weatherJson);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }
      function toCelsius(kelvin: number) {
      return Math.round(kelvin - 273.15);
    }

    function toFahrenheit(kelvin: number) {
      return Math.round((kelvin - 273.15) * 9/5 + 32);
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Weather App
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            placeholder="Type a city's name (e.g. Paris)"
            value={city}
            onChange={eventHandler}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchWeatherData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
        </div>

        {weatherData ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="text-lg text-gray-600">
              {weatherData.weather[0].description}
            </p>
            <p className="text-4xl font-bold text-blue-600">
            {weatherData.main.temp}°C
            </p>
            <p className="text-2xl text-gray-500">
            {toFahrenheit(weatherData.main.temp)}°F
            </p>
            <p className="text-sm text-gray-500">
              Feels like {Math.round(weatherData.main.feels_like)}°C
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">No data yet</p>
        )}
      </div>
    </div>
  );
}
