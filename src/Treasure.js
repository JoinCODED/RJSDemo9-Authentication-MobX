import React, { Component } from "react";
import { observer } from "mobx-react";
import { Redirect } from "react-router-dom";

// Stores
import thingStore from "./store/thingStore";
import authStore from "./store/authStore";

// Components
import ThingItem from "./ThingItem";

class Treasure extends Component {
  componentDidMount() {
    thingStore.fetchTreasure();
  }

  render() {
    const rows = thingStore.treasure.map(thing => (
      <ThingItem key={thing.name} thing={thing} />
    ));

    if (!authStore.user) return <Redirect to="/login" />;

    return (
      <div className="mt-5 mx-auto col-6 text-center">
        <h1>Treasure</h1>
        <table style={{ width: "100%" }}>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

export default observer(Treasure);
