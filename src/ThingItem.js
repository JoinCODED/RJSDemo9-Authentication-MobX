import React from "react";

const ThingItem = ({ thing }) => {
  return (
    <tr>
      <td className="text-center">{thing.name}</td>
    </tr>
  );
};

export default ThingItem;
