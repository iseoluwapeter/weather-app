import { ChangeEvent, useState } from "react";
import axios from "axios";

const App = (): JSX.Element => {
  const [term, setTerm] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]); // Simplified type

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
      setOptions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    if (value) getSearchOptions(value); // Fetch options only if input is not empty
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400">
      <div className="p-4 bg-white rounded shadow-lg text-center">
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
        <input
          type="text"
          value={term}
          placeholder="Search for a city..."
          className="border p-2 mt-4 w-full rounded"
          onChange={onInputChange}
        />
        <ul className="mt-2 bg-white shadow rounded">
          {options.map((option, index) => (
            <li
              key={index}
              className="p-2 border-b hover:bg-gray-200 cursor-pointer"
            >
              {option.name}, {option.state ? `${option.state}, ` : ""}
              {option.country}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
