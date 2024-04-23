import { ReactNode } from "react";

export interface Header {
  width: number | string;
  head: string;
}

export interface TableHeadProps {
  headers: Header[];
  children: ReactNode;
}

export type GetValueFn = (rates: RatesObject) => number | string;

export type RatesObject = { RUB: number; USD: number; EUR: number };

export interface RatesData {
  rates: RatesObject;
  timestamp: number;
  base: string;
  date: string;
}

export interface RatesListProps {
  firstRates: RatesData | null;
  secondRates: RatesData | null;
  thirdRates: RatesData | null;
}



