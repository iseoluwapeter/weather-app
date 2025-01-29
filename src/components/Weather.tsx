import axios from "axios";
import { ChangeEvent, useState } from "react";
import {motion} from "framer-motion";

const Weather = (): JSX.Element => {
  //setting our term into the input
  const [city, setCity] = useState<string>("");
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  //FETCH CITY OPTIONS
  const getSearchOptions = async (value: string) => {
    try {
      const { data } = await axios.get(
        "http://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: value,
            limit: 5,
            appid: "5e2220f666d69444af0abb688c82a3b6",
          },
        }
      );
      console.log(data);
      setCityOptions(data);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  //Handle city input changes
  const onCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    if (value) getSearchOptions(value);
  };

  //FETCH WEATHER FORECAST FOR DIFFERENT CITIES
  const fetchForecast = async () => {
    if (!cityOptions.length) {
      setError("Please enter a valid city.");
      return;
    }
    try {
      const { lat, lon } = cityOptions[0];
      const { data } = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather?",
        {
          params: {
            lat,
            lon,
            appid: "5e2220f666d69444af0abb688c82a3b6",
            units: "metric",
          },
        }
      );
      console.log(data);
      setForecastData(data);
      setError("");

      //clear dropdown menu after fetching forecast
      setCityOptions([]);
    } catch (error) {
      console.error("Error fetching weather forecast");
      setError("Failed to fetch forecast. Please try again!");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-7">
      <div className="w-full py-9 px-7 mx- md:max-w-[500px]   flex flex-col items-center md:px-10 lg:py-20 lg:px-14   bg-white bg-opacity-20 backdrop-blur-ls  rounded drop-shadow-lg text-zinc-700 text-center ">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Weather</span> Forecast
        </h1>
        <p className="text-white px-1">
          Type in the city you want to know its weather condition in the space
          provide below
        </p>

        {/* INPUT AND SEARCH BUTTON  */}
        <div className="w-full  ">
          <input
            type="text"
            value={city}
            placeholder="Search for a city..."
            className=" p-2 mt-4  rounded-l-md "
            onChange={onCityChange}
          />

          <button
            className="border-blue-500 p-2 rounded-r-md font-semibold bg-blue-500 text-white hover:bg-gray-500 hover:transition-all "
            onClick={fetchForecast}
          >
            Search
          </button>
        </div>

        {/* error message */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {/* CITY OPTION DROPDOWN  */}
        <ul className="w-full mt-2 mx-3 md:mx-2 bg-white shadow rounded-md">
          {cityOptions.map((city, index) => (
            <li
              key={index}
              className=" p-2 border-b hover:bg-gray-500 hover:text-white cursor-pointer"
            >
              <button onClick={fetchForecast}>
                {city.name}, {city.state}, {city.country}
              </button>
            </li>
          ))}
        </ul>

        {/* Weather forecast display */}
        {forecastData && (
          <motion.div
            className="mt-4 mx-3 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* City Name and Country */}
            <motion.h2
              className="text-xl font-semibold bg-orange-400 rounded py-4 sm:py-7 text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {forecastData.name}, {forecastData.sys.country}
            </motion.h2>

            {/* Forecast Details */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 items-center mt-5 border rounded p-4 bg-white bg-opacity-30 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Weather Icon Section */}
              <motion.div
                className="bg-blue-500 rounded flex items-center justify-center w-full sm:w-32 py-4 sm:py-10"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`}
                  alt={forecastData.weather[0].description}
                  className="w-16 h-16"
                />
              </motion.div>

              {/* Weather Details Section */}
              <motion.div
                className="bg-white w-full rounded p-4 text-center sm:text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h1 className="font-bold text-3xl">
                  {forecastData.main.temp} °C
                </h1>
                <h2 className="text-lg capitalize text-gray-700">
                  {forecastData.weather[0].description}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Feels like: {forecastData.main.feels_like}°C
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        
      </div>
    </div>
  );
};

export default Weather;
