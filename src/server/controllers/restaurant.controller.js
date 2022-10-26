const { getOpenRestaurants } = require("../services/restaurants.service");

const retrieveOpenRestaurants = async (req, res) => {
  const { day, time } = req.params;
  console.log(req.params);
  if (!day || !time)
    return res
      .status(400)
      .send({ errors: "Must provide day & time parameters" });
  const restaurants = await getOpenRestaurants({ day, time });
  res.status(200).send(restaurants);
};

module.exports = { retrieveOpenRestaurants };
