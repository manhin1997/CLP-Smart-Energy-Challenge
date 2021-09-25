import axios from "axios";
import { TempResult } from "./Types/TempResult";
import { TempResults } from "./Types/TempResults";
import {Forcasts} from "./Types/Forcasts";
import { ForcastResult } from "./Types/ForcastResult";

const getCurrentTemp = (temps : TempResults) => {
    console.log("Current Temperature for all districts: ");
    console.log("---------");
    temps.data.forEach((temp: TempResult)=> {
        console.log(`${temp.place}: ${temp.value} °${temp.unit}`);
    });
    console.log("---------");
}

const getSpecificTemp = (temps : TempResults, district : string) => {

    const tempResult = temps.data.find(ele => ele.place === district);
    if(tempResult){
        console.log(`Current Temperature for ${tempResult.place} is ${tempResult.value} °${tempResult.unit}`);
    }
    else{
        console.log('Provided District not found');
    }
    console.log("---------");
}

const getTmp = async () => {
    try {
        const result = await axios.get("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en");
        const temps : TempResults = result.data.temperature;
        return temps;
    } catch (error) {
        return null;
    }
};

const getWeatherForecast = async () => {
    const showforeCastValue = (MinOrMax : "min" | "max", forcastValue : ForcastResult) => {
        let consoleString = "";
        if(MinOrMax === "min" && forcastValue.unit === "C"){
            consoleString = `>>>>Min: ${forcastValue.value} °${forcastValue.unit}`;
        }
        else if(MinOrMax === "max" && forcastValue.unit === "C"){
            consoleString = `>>>>Max.: ${forcastValue.value} °${forcastValue.unit}`;
        }
        else if(MinOrMax === "min" && forcastValue.unit === "percent"){
            consoleString = `>>>>Min ${forcastValue.value} %`;
        }
        else{
            consoleString = `>>>>Max: ${forcastValue.value} %`;
        }
        console.log(consoleString);
    }

    try {
        const result = await axios.get("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en");
        const forcasts : Forcasts = result.data;
        //Foreach from index 1
        console.log("Next 3-day weather forcast")
        for(let i = 1; i < 4; ++i){
            console.log('---------');
            console.log(`${forcasts.weatherForecast[i].week.substring(0, 3)} (Date of ${forcasts.weatherForecast[i].forecastDate.substring(0, 4)}-${forcasts.weatherForecast[i].forecastDate.substring(4,6)}-${forcasts.weatherForecast[i].forecastDate.substring(6,8)})`);
            console.log(">>Temperature:");
            //Show Record
            showforeCastValue("max", forcasts.weatherForecast[i].forecastMaxtemp);
            showforeCastValue("min", forcasts.weatherForecast[i].forecastMintemp);
            console.log(">>Humidity:");
            showforeCastValue("max", forcasts.weatherForecast[i].forecastMaxrh);
            showforeCastValue("min", forcasts.weatherForecast[i].forecastMinrh);
        }
        console.log('---------');
    } catch (error) {
        console.log("Hong Kong Obvervatory API not working!");
    }
}

const Question1 = async () => {
    //Part A and B
    const temps = await getTmp();
    if(temps){
        //Part A
        getCurrentTemp(temps);
        //Part B
        getSpecificTemp(temps, "Sha Tin");
    }
    else{
        console.log("Hong Kong Obvervatory API not working!");
    }
    //Part C
    await getWeatherForecast();
}

const Question2 = (date : string) => {

    //Seperate using regex
    const filterResult = date.split(/[ ,-]/).filter(ele => ele.length > 0);
    //check whether the string has a whole number
    const isNumeric = (value : string) => {
        return /^-?\d+$/.test(value);
    }
    const isoDateTimeOffset = (value : Date) => {
        return new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
    }
    const SHMonthToNumber = (value : string ) : number => {

        const SHMonth : {[key : string] : number} = {
            "Jan" : 0,
            "Feb" : 1,
            "Mar" : 2,
            "Apr" : 3,
            "May" : 4,
            "Jun" : 5,
            "Jul" : 6,
            "Aug" : 7,
            "Sep" : 8,
            "Oct" : 9,
            "Nov" : 10,
            "Dec" : 11
        };

        if(value in SHMonth){
            return SHMonth[value];
        }
        return 0;
    }

    const LMonthToNumber = (value : string ) : number => {

        const SHMonth : {[key : string] : number} = {
            "January" : 0,
            "February" : 1,
            "March" : 2,
            "April" : 3,
            "May" : 4,
            "June" : 5,
            "July" : 6,
            "August" : 7,
            "September" : 8,
            "October" : 9,
            "November" : 10,
            "December" : 11
        };

        if(value in SHMonth){
            return SHMonth[value];
        }
        return 0;
    }

    const TimeToHrMin = (value: string) => {
        //Check length
        if(value.length > 5){
            //d case
            const time = value.slice(0, -2);
            const zone = value.slice(-2);
            if(zone === "pm"){
                return [parseInt(time.slice(0,2)) % 12 + 12 , parseInt(time.slice(3,5))]
            }
            else{
                return [parseInt(time.slice(0,2)) % 12, parseInt(time.slice(3,5))]
            }
        }
        else{
            const time = value; 
            return [parseInt(time.slice(0,2)), parseInt(time.slice(3,5))]
        }
    }



    //if 1st result is a string, it would be : a | d
    if(!isNumeric(filterResult[0])){
        //if 4th exist, it would be : d
        if(filterResult.length >= 4){
            const HrMin = TimeToHrMin(filterResult[3]);
            const date = new Date(parseInt(filterResult[2]), SHMonthToNumber(filterResult[0]), parseInt(filterResult[1]), HrMin[0], HrMin[1]);
            return isoDateTimeOffset(date).toISOString();
        }
        //a case
        else{
            const date = new Date(parseInt(filterResult[2]), SHMonthToNumber(filterResult[0]), parseInt(filterResult[1]));
            return isoDateTimeOffset(date).toISOString();
        }
    }
    //if 1st result is a number > 31, it would be b | e
    else if(parseInt(filterResult[0]) > 31){
        //if 4th exist, it would be : e
        if(filterResult.length >= 4){
            const HrMin = TimeToHrMin(filterResult[3]);
            const date = new Date(parseInt(filterResult[0]), SHMonthToNumber(filterResult[1]), parseInt(filterResult[2]), HrMin[0], HrMin[1]);
            return isoDateTimeOffset(date).toISOString();
        }
        else{
            const date = new Date(parseInt(filterResult[0]), SHMonthToNumber(filterResult[1]), parseInt(filterResult[2]));
            return isoDateTimeOffset(date).toISOString();
        }
    }
    //it would be c
    else if(isNumeric(filterResult[0])){
        const date = new Date(parseInt(filterResult[2]), LMonthToNumber(filterResult[1]), parseInt(filterResult[0]));
        return isoDateTimeOffset(date).toISOString();
    }
    else{
        return "Invalid Date"
    }
}

const Main = async () => {
    console.log("==============Question 1==============");
    await Question1();
    console.log("==============Question 2==============");
    console.log(Question2("Sep 18, 2021"));
    console.log(Question2("2021-09-18"));
    console.log(Question2("18 September 2021"));
    console.log(Question2("Sep 18, 2021, 12:00pm"));
    console.log(Question2("2021-09-18 13:00"));
    console.log("======================================");
}

Main();
