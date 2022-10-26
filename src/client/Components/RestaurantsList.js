import React from "react";

const RestaurantsList = ({ data }) => {
  return (
    <div>
      {data.map((rest) => (
        <div>{rest.name.toString()}</div>
      ))}
    </div>
  );
};

export default RestaurantsList;
