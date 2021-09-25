import { ForcastResult } from "./ForcastResult";


export type Forcast = {
    forecastDate: string;
    week: string;
    forecastMaxtemp: ForcastResult;
    forecastMintemp: ForcastResult;
    forecastMaxrh: ForcastResult;
    forecastMinrh: ForcastResult;
};
