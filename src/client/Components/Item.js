import React from "react";

const Item = ({ item }) => {
  return (
    <div>
      Item - {Object.keys(item)[0]}: {item[Object.keys(item)[0]]}
    </div>
  );
};

export default Item;
