import axios from "axios";
import { RatesData } from "../types/types";

export const fetchRatesPolls = async (source: 'first' | 'second' | 'third'): Promise<RatesData> => {
  const response = await axios.get<RatesData>(`http://localhost:3000/api/v1/${source}/poll`);
  return response.data;
};