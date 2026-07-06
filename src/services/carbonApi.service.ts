import axios from "axios";
import { GenerationInterval } from "../types/energy.types";

const DEFAULT_BASE_URL = "https://api.carbonintensity.org.uk";
const REQUEST_TIMEOUT_MS = 10000;

export async function fetchGenerationMix(
  from: string,
  to: string
): Promise<GenerationInterval[]> {
  const baseUrl = process.env.CARBON_API_BASE_URL || DEFAULT_BASE_URL;
  const response = await axios.get(
    `${baseUrl.replace(/\/$/, "")}/generation/${from}/${to}`,
    {
      timeout: REQUEST_TIMEOUT_MS
    }
  );
  return response.data.data;
}
