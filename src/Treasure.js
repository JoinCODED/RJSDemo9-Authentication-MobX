import React, { Component } from "react";
import { observer } from "mobx-react";

// Store
import thingStore from "./store/thingStore";
import ThingItem from "./ThingItem";

class Treasure extends Component {
  componentDidMount() {
    thingStore.fetchTreasure();
  }

  render() {
    const rows = thingStore.treasure.map(thing => (
      <ThingItem key={thing.name} thing={thing} />
    ));

    // if (authStore.user) {
    return (
      <div className="mt-5 mx-auto col-6 text-center">
        <h1>Treasure</h1>
        <table style={{ width: "100%" }}>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
    // }

    // return <Redirect to="/" />;
  }
}

export default observer(Treasure);
