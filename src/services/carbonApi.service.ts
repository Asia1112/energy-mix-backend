import axios from "axios";
import { GenerationInterval } from "../types/energy.types";

const BASE_URL = "https://api.carbonintensity.org.uk";

export async function fetchGenerationMix(
  from: string,
  to: string
): Promise<GenerationInterval[]> {
  const response = await axios.get(`${BASE_URL}/generation/${from}/${to}`);
  return response.data.data;
}