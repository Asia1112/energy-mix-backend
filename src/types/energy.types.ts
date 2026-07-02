export type FuelName =
  | "biomass"
  | "coal"
  | "gas"
  | "hydro"
  | "imports"
  | "nuclear"
  | "other"
  | "solar"
  | "wind";

export interface GenerationMixItem {
  fuel: FuelName;
  perc: number;
}

export interface GenerationInterval {
  from: string;
  to: string;
  generationmix: GenerationMixItem[];
}

export interface DailyEnergyMix {
  date: string;
  mix: Record<string, number>;
  cleanEnergyPercentage: number;
}

export interface ChargingWindowResult {
  start: string;
  end: string;
  averageCleanEnergyPercentage: number;
}