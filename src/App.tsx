import { useEffect, useState } from "react";
import RatesList from "./components/RatesList/RatesList";
import cls from "./index.module.css";
import { RatesData } from "./types/types";
import { fetchRatesPolls } from "./api/fetchRatesPolls";
import { fetchInitialRatesData } from "./api/fetchInitialRatesData";

function App() {
  const [firstRates, setFirstRates] = useState<RatesData | null>(null);
  const [secondRates, setSecondRates] = useState<RatesData | null>(null);
  const [thirdRates, setThirdRates] = useState<RatesData | null>(null);

  const fetchInitialRates = async () => {
    try {
      const [firstData, secondData, thirdData] = await Promise.all([
        fetchInitialRatesData('first'),
        fetchInitialRatesData('second'),
        fetchInitialRatesData('third'),
      ]);
      setFirstRates(firstData);
      setSecondRates(secondData);
      setThirdRates(thirdData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const longPolling = async () => {
    try {
      const [firstData, secondData, thirdData] = await Promise.all([
        fetchRatesPolls('first'),
        fetchRatesPolls('second'),
        fetchRatesPolls('third'),
      ]);
      setFirstRates(firstData);
      setSecondRates(secondData);
      setThirdRates(thirdData);
      await longPolling();

    } catch (error) {
      console.error('Error fetching data:', error);
      setTimeout(() => {
        longPolling();
      }, 500);
    }
  };

  useEffect(() => {
    fetchInitialRates();
    longPolling();
  }, []);

  return (
    <div className={cls.wrap}>
      <h1 className={cls.title}>Курс Валютных пар</h1>
      <RatesList firstRates={firstRates} secondRates={secondRates} thirdRates={thirdRates} />
    </div>
  );
}

export default App;
