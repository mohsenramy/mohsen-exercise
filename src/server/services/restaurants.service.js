const { pool } = require("../utils/db.config");

const getOpenRestaurants = ({ day, time }) => {
  return pool
    .query(
      "SELECT oh.restaurant_id, re.name FROM public.openingtimes oh JOIN public.restaurants re on oh.restaurant_id = re.restaurant_id AND day = $1 and $2 BETWEEN oh.open AND oh.close",
      [day, time]
    )
    .then((results) => {
      return results.rows;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

module.exports = { getOpenRestaurants };
