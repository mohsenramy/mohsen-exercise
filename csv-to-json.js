// / require csvtojson
var csv = require("csvtojson");
const fs = require("fs");
const { pool } = require("./src/server/utils/db.config");
const format = require("pg-format");
const { resourceLimits } = require("worker_threads");
const { DAYS, daysArr } = require("./src/server/utils/constants");

function createOpeningsRecord(day, open, close) {
  return {
    day: day,
    open: open,
    close: close,
  };
}

function formatOpeningHours(hour, minutes) {
  return `${hour}:${minutes}`;
}

function parseTimeEntry(entry) {
  let parts = entry.split("_");
  let hours = parseInt(parts[0].split(":")[0]);
  let mins = parts[0].split(":")[1] || "00";
  // console.log({ mins });
  hours = parts[1] === "pm" && hours < 12 ? hours + 12 : hours;
  hours = parts[1] === "am" && hours === 12 ? 0 : hours;
  console.log("->time: " + formatOpeningHours(hours, mins));
  return formatOpeningHours(hours, mins);
}

function parseDayEntry(entry, opHrs) {
  try {
    let openDays = entry.toUpperCase().replace(/,/g, "").split("-");
    // console.log({ openDays }, openDays.length);
    let dOpen = [];
    if (openDays.length === 1) {
      dOpen = [createOpeningsRecord(DAYS[openDays[0]], opHrs[1], opHrs[0])];
    } else if (openDays.length > 1) {
      console.log("---------->DAYS", DAYS[openDays[0]], openDays[0]);
      console.log("---------->DAYS", DAYS[openDays[1]], openDays[1]);
      // let daysCount = 0;
      // let startDay = 0;
      // if (DAYS[openDays[1]] > DAYS[openDays[0]]) {
      //   daysCount = DAYS[openDays[1]] - DAYS[openDays[0]] + 1;
      //   startDay = DAYS[openDays[0]];
      // } else {
      //   daysCount = DAYS[openDays[0]] - DAYS[openDays[1]] + 1;
      //   startDay = DAYS[openDays[1]];
      // }
      let daysCount = DAYS[openDays[1]] - DAYS[openDays[0]] + 1;
      console.log({ daysCount });
      const opDaysArr = Array.from(
        new Array(daysCount),
        (x, i) => i + DAYS[openDays[0]]
      );

      dOpen = opDaysArr.map((d) => {
        // console.log({ d }, daysArr[d - 1]);
        return createOpeningsRecord(d, opHrs[1], opHrs[0]);
      });
    }
    // console.log({ dOpen });
    return dOpen;
  } catch (error) {
    console.log({ error });
  }
}
// const DAYS = {
//   MON: 1,
//   TUE: 2,
//   WED: 3,
//   THU: 4,
//   FRI: 5,
//   SAT: 6,
//   SUN: 7,
// };
// const daysArr = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const readableStream = fs.createReadStream("./restaurants.csv", {
  encoding: "utf8",
});
const insertRestaurantsData = async (restaurant) => {
  pool
    .query(
      `INSERT INTO restaurants (name) VALUES ($1) RETURNING restaurant_id`,
      [restaurant.name]
    )
    .then((results) => {
      console.log(results.rows[0]);
      const restaurantId = results.rows[0].restaurant_id;
      const values = restaurant.openingHours.map((obj) => [
        restaurantId,
        obj.day,
        obj.open,
        obj.close,
      ]);
      console.log({ values });
      pool
        .query(
          format(
            "INSERT INTO openingtimes (restaurant_id,day,open,close) VALUES %L",
            values
          ),
          []
        )
        .then((results) => {
          console.log({ rowCount: results.rowCount });
        })
        .catch((e) => {
          throw e;
        });
    })
    .catch((e) => {
      throw e;
    });
};

csv({
  noheader: true,
  headers: ["name", "openingHours"],
})
  .fromStream(readableStream)
  .subscribe((jsonObj) => {
    //single json object will be emitted for each csv line
    // parse each json asynchronousely
    return new Promise((resolve, reject) => {
      let hours = jsonObj.openingHours
        .replace(/\sam/g, "_am")
        .replace(/\spm/g, "_pm")
        .replace(/\s-\s,/g, "+")
        .trim()
        .split("/");
      hours = hours.map((record) => record.trim().split(" "));

      // console.log({ hours });
      const dbObject = {
        name: jsonObj.name,
        openingHours: hours,
      };
      let opHrs = [];
      let opDys = [];
      hours.forEach((record) => {
        console.log({ record });
        opHrs = [];
        record.reverse().forEach((entry) => {
          // console.log({ opDys }, { opHrs });
          // console.log("\n----", { entry });
          if (entry !== "-") {
            // console.log(entry);
            if (entry.includes("_pm") || entry.includes("_am")) {
              opHrs.push(parseTimeEntry(entry));
            } else if (daysArr.some((d) => entry.toUpperCase().includes(d))) {
              let newDays = parseDayEntry(entry, opHrs);
              opDys = [...opDys, ...newDays];
            }
          }
        });
      });
      // console.log({ opDys: JSON.stringify(opDys, null, 2) });
      let restaurant = { name: jsonObj.name, openingHours: opDys };
      console.log(restaurant);

      // console.log(jsonObj);
      // console.log(dbObject);
      // resolve();
      insertRestaurantsData(restaurant)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          console.log(e);
          reject();
        });
    });
  });
