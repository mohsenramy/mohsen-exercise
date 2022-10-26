import React from "react";

const RestaurantsList = ({ data }) => {
  return (
    <ul>
      {data.map((rest) => (
        <li>{rest.name.toString()}</li>
      ))}
    </ul>
  );
};

export default RestaurantsList;
