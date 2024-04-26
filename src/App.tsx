import { useEffect, useState } from "react";
import RatesList from "./components/RatesList/RatesList";
import cls from "./index.module.css"
import { RatesData } from "./types/types";
import { fetchRatesPolls } from "./api/fetchRatesPolls";
import { fetchInitialRatesData } from "./api/fetchInitialRatesData";

function App() {
  const [firstRates, setFirstRates] = useState<RatesData | null>(null);
  const [secondRates, setSecondRates] = useState<RatesData | null>(null);
  const [thirdRates, setThirdRates] = useState<RatesData | null>(null);
  const [longPolling, setLongPolling] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<null | number>(null);

  const parseData = (set: React.Dispatch<React.SetStateAction<RatesData | null>>, data: RatesData) => {
    set({
      ...data, rates: {
        RUB: Number(data.rates.RUB.toFixed(2)),
        EUR: Number(data.rates.EUR.toFixed(2)),
        USD: Number(data.rates.USD.toFixed(2))
      }
    });
  }

  const fetchInitialRates = async () => {
    try {
      const [firstData, secondData, thirdData] = await Promise.all([
        fetchInitialRatesData('first'),
        fetchInitialRatesData('second'),
        fetchInitialRatesData('third'),
      ]);

      parseData(setFirstRates, firstData);
      parseData(setSecondRates, secondData);
      parseData(setThirdRates, thirdData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const startLongPolling = async () => {
    setLongPolling(true);

    const newTimeoutId = setTimeout(startLongPolling, 5000);
    setTimeoutId(newTimeoutId);

    try {
      const [firstData, secondData, thirdData] = await Promise.all([
        fetchRatesPolls('first'),
        fetchRatesPolls('second'),
        fetchRatesPolls('third'),
      ]);

      parseData(setFirstRates, firstData);
      parseData(setSecondRates, secondData);
      parseData(setThirdRates, thirdData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const stopLongPolling = () => {
    setLongPolling(false);

    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  useEffect(() => {
    fetchInitialRates();
    startLongPolling();
  }, []);

  return (
    <div className={cls.wrap}>
      <h1 className={cls.title}>Курс Валютных пар</h1>
      <RatesList firstRates={firstRates} secondRates={secondRates} thirdRates={thirdRates} />
      {firstRates && secondRates && thirdRates &&
        <button disabled={longPolling ? false : true} className={cls.button} onClick={() => (longPolling && stopLongPolling())}>
          stop long polling
        </button>
      }
    </div>
  );
}

export default App;
