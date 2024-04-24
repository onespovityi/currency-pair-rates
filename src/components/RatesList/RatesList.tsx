/* eslint-disable @typescript-eslint/no-explicit-any */
import cls from "./RatesList.module.css"
import TableHead from "../TableHead/TableHead";
import { GetValueFn, Header, RatesListProps, RatesObject } from "../../types/types";

const ratesHeaders: Header[] = [
  { width: "20%", head: "Pair name/market" },
  { width: "20%", head: "First" },
  { width: "20%", head: "Second" },
  { width: "20%", head: "Third" },
];

const RatesList: React.FC<RatesListProps> = ({ firstRates, secondRates, thirdRates }) => {

  if (firstRates === null || secondRates === null || thirdRates === null) return "Loading..."

  const currencyPairs: { name: string; getValue: GetValueFn }[] = [
    { name: 'RUB/CUPCAKE', getValue: (rates: RatesObject) => rates.RUB },
    { name: 'USD/CUPCAKE', getValue: (rates: RatesObject) => rates.USD },
    { name: 'EUR/CUPCAKE', getValue: (rates: RatesObject) => rates.EUR },
    { name: 'RUB/USD', getValue: (rates: RatesObject) => Number((rates.RUB / rates.USD).toFixed(2)) },
    { name: 'RUB/EUR', getValue: (rates: RatesObject) => Number((rates.RUB / rates.EUR).toFixed(2)) },
    { name: 'EUR/USD', getValue: (rates: RatesObject) => Number((rates.EUR / rates.USD).toFixed(2)) }
  ];

  const getMinValue = <T extends string | number>(getValue: (rates: RatesObject) => T, rates: Array<RatesObject>): T => {
    const values = rates.map(getValue);
    const numericValues = values.map(Number);
    return Math.min(...numericValues) as T;
  };

  const isMinValue = (getValue: GetValueFn, rates: RatesObject) =>
    getMinValue(getValue, [firstRates.rates, secondRates.rates, thirdRates.rates]) === getValue(rates);

  return (
    <>
      <div className={cls.wrapper}>
        <TableHead headers={ratesHeaders}>
          {currencyPairs.map(({ name, getValue }) => {
            const isMinFirst = isMinValue(getValue, firstRates.rates)
            const isMinSecond = isMinValue(getValue, secondRates.rates)
            const isMinThird = isMinValue(getValue, thirdRates.rates)
            return <tr key={name}>
              <td>{name}</td>
              <td className={isMinFirst ? cls.highlighted : ''}>
                {getValue(firstRates.rates) || '-'}
              </td>
              <td className={isMinSecond ? cls.highlighted : ''}>
                {getValue(secondRates.rates) || '-'}
              </td>
              <td className={isMinThird ? cls.highlighted : ''}>
                {getValue(thirdRates.rates) || '-'}
              </td>
            </tr>
          })}
        </TableHead>
      </div >
    </>
  );
}

export default RatesList;
