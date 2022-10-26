import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DAYS, daysArray } from "../../server/utils/constants";
import { useState } from "react";
import axios from "axios";
import RestaurantsList from "../Components/RestaurantsList";
import { Box, Button } from "@mui/material";
import { Stack } from "@mui/system";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export default function Restaurants() {
  const [value, setValue] = useState(dayjs());
  const [data, setData] = useState(null);
  const [resStatus, setResStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOpenRestaurantsHandler = () => {
    // dayjs.extend(isoWeek);
    // console.log(dayjs(value).isoWeekday());
    let d = new Date(value);
    console.log(d.getDay());
    console.log(dayjs(value).day());
    console.log(daysArray[d.getDay()]);
    console.log(DAYS[daysArray[d.getDay()]]);
    console.log(DAYS[daysArray[dayjs(value).day()]]);
    console.log(dayjs(value).format("H:m:00"));

    setLoading(true);
    // const data = {
    //   day: DAYS[daysArray[dayjs(value).day()]],
    //   time: dayjs(value).format("H:m:00"),
    // };
    // console.log({ data });

    axios
      .get(
        `/api/restaurants/open/${DAYS[daysArray[dayjs(value).day()]]}/${dayjs(
          value
        ).format("H:m:00")}`
      )
      .then((res) => {
        console.log(res);
        setData(res.data);
        setResStatus(res.status);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));

    // let data = JSON.stringify({
    //   day: "3",
    //   time: "13:7:00",
    // });

    // let config = {
    //   method: "get",
    //   url: "/api/restaurants/open",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   params: data,
    // };

    // axios(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <>
      <h1>Restaurants</h1>

      <div className="input-container">
        <div
          className="input-container-nested"
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <label>Select date & time:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => (
                <TextField {...props} sx={{ marginLeft: "1em" }} />
              )}
              // label="Select Date & Time"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
            />
          </LocalizationProvider>
          {/* <label className="dimmed-text">{value.toString()}</label> */}
        </div>
        <Button
          sx={{ height: "50px" }}
          variant="contained"
          onClick={getOpenRestaurantsHandler}
        >
          Get Open Restaurants
        </Button>
      </div>
      <div></div>
      {!loading && data && (
        <div>
          <h2>RESULTS</h2>
          <div>
            <RestaurantsList data={data} />
          </div>
        </div>
      )}
    </>
  );
}
