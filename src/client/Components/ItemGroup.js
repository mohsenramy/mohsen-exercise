import React from "react";
import Item from "./Item";

export const ItemGroup = ({ title, items }) => {
  console.log({ title }, { items }, { itemLength: items.length });
  const _items = Object.entries(items);
  console.log({ _items });
  return (
    <>
      <div className="item-group-header">{title}</div>
      {/* <ul>{items ? _items.map((item) => <Item data={item} />) : null}</ul> */}
      <ul>
        {items
          ? Object.keys(items).map(function (keyName, keyIndex) {
              // use keyName to get current key's name
              const i = {
                [keyName]: items[keyName],
              };
              return <Item item={i} />;
              // and a[keyName] to get its value
            })
          : null}
      </ul>
      {/* <ul>{for (const [key,value] of Object.entries(items)</ul> */}
    </>
  );
};
