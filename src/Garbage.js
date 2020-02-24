import React, { Component } from "react";
import { observer } from "mobx-react";

// Store
import thingStore from "./store/thingStore";
import ThingItem from "./ThingItem";

class Garbage extends Component {
  componentDidMount() {
    thingStore.fetchGarbage();
  }

  render() {
    const thingRows = thingStore.garbage.map(thing => (
      <ThingItem key={thing.name} thing={thing} />
    ));

    return (
      <div className="mt-5 mx-auto col-6 text-center">
        <h1>Garbage</h1>
        <table style={{ width: "100%" }}>
          <tbody>{thingRows}</tbody>
        </table>
      </div>
    );
  }
}

export default observer(Garbage);
