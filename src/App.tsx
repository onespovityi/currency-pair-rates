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
      const firstData = await fetchInitialRatesData('first');
      parseData(setFirstRates, firstData)

      const secondData = await fetchInitialRatesData('second');
      parseData(setSecondRates, secondData)

      const thirdData = await fetchInitialRatesData('third');
      parseData(setThirdRates, thirdData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const startLongPolling = async () => {
    try {
      const firstData = await fetchRatesPolls('first');
      parseData(setFirstRates, firstData)

      const secondData = await fetchRatesPolls('second');
      parseData(setSecondRates, secondData)

      const thirdData = await fetchRatesPolls('third');
      parseData(setThirdRates, thirdData)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      startLongPolling()
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
    </div>
  );
}

export default App;
