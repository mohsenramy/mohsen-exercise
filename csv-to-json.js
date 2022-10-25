// / require csvtojson
var csv = require("csvtojson");
const fs = require("fs");

function getObjKey(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

function createOpeningData(day, from, to) {
  return {
    day: day,
    from: from,
    to: to,
  };
}

function formatOpeningHours(hour, minutes) {
  return `${hour}:${minutes}`;
}

function parsTimeEntry(entry) {
  let parts = entry.split("_");
  let hours = parts[0].split(":")[0];
  let mins = parts[0].split(":")[1] || "00";
  // console.log({ mins });
  hours = parts[1] === "pm" ? parseInt(hours) + 12 : hours;
  // console.log("->time: " + formatOpeningHours(hours, mins));
  return formatOpeningHours(hours, mins);
}
const DAYS = {
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  SUN: 7,
};
const daysArr = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const readableStream = fs.createReadStream("./restaurants3.csv", {
  encoding: "utf8",
});
csv({
  noheader: true,
  headers: ["name", "openingHours"],
})
  .fromStream(readableStream)
  .subscribe(function (jsonObj) {
    //single json object will be emitted for each csv line
    // parse each json asynchronousely
    return new Promise(function (resolve, reject) {
      let hours = jsonObj.openingHours
        .replace(/\sam/g, "_am")
        .replace(/\spm/g, "_pm")
        .replace(/\s-\s,/g, "+")
        .trim()
        .split("/");
      hours = hours.map((record) => record.trim().split(" "));

      console.log({ hours });
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
          console.log("\n----", { entry });
          if (entry !== "-") {
            // console.log(entry);
            if (entry.includes("_pm") || entry.includes("_am")) {
              // let parts = entry.split("_");
              // let hours = parts[0].split(":")[0];
              // let mins = parts[0].split(":")[1] || "00";
              // console.log({ mins });
              // hours = parts[1] === "pm" ? parseInt(hours) + 12 : hours;
              // console.log("->time: " + formatOpeningHours(hours, mins));
              opHrs.push(parsTimeEntry(entry));
            }
            // if (entry.includes("_am")) {
            //   let parts = entry.split("_");
            //   let hours = parts[0].split(":")[0];
            //   let mins = parts[0].split(":")[1] || "00";
            //   console.log({ mins });
            //   console.log("->time: " + hours + ":" + mins);
            //   opHrs.push(hours + ":" + mins);
            // }
            if (daysArr.some((d) => entry.toUpperCase().includes(d))) {
              // console.log("DayEntry: " + entry);
              let openDays = entry.toUpperCase().replace(/,/g, "").split("-");
              console.log({ openDays }, openDays.length);
              let dOpen;
              if (openDays.length === 1) {
                opDys.push(
                  createOpeningData(DAYS[openDays[0]], opHrs[1], opHrs[0])
                );
              } else if (openDays.length > 1) {
                // console.log("---------->DAYS", DAYS["THU"], openDays[1]);
                let daysCount = DAYS[openDays[1]] - DAYS[openDays[0]] + 1;
                console.log({ daysCount });
                const opDaysArr = Array.from(
                  new Array(daysCount),
                  (x, i) => i + DAYS[openDays[0]]
                );

                dOpen = opDaysArr.forEach((d) => {
                  console.log({ d }, daysArr[d - 1]);
                  opDys.push(createOpeningData(d, opHrs[1], opHrs[0]));
                });
              }
            }
          }
        });
      });
      console.log({ opDys });

      // console.log(jsonObj);
      // console.log(dbObject);
      // resolve();
      // asyncStoreToDb(json, function () {
      //   resolve();
      // });
    });
  });

//Use async / await
// const jsonArray=await csv().fromFile(filePath);
// let arr = ["Mon-Thu,", "Sun", "9_am", "-", "10_pm"];
// const index = arr.indexOf("-");
// console.log(index);
// arr.splice(index, 1);
// console.log(arr);

// const rec = ["Mon-Thu,", "Sun", "11:30_am", "-", "9_pm"];

// const range = 'TUE-Fri'
// const days = range.toUpperCase().split('-')
// console.log(days)
// let daysCount = DAYS[days[1]] - DAYS[days[0]] + 1
// console.log(daysCount)
// console.log(Array.from(new Array(daysCount), (x, i) => i + DAYS[days[0]]))
