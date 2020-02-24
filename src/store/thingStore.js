import { decorate, observable } from "mobx";

import { instance } from "./instance";

class ThingStore {
  garbage = [];

  treasure = [];

  fetchGarbage = async () => {
    try {
      const res = await instance.get("things/");
      const things = res.data;
      this.garbage = things;
    } catch (err) {
      console.error(err);
    }
  };

  fetchTreasure = async () => {
    try {
      const res = await instance.get("private-things/");
      const things = res.data;
      this.treasure = things;
    } catch (err) {
      console.error(err);
    }
  };
}

decorate(ThingStore, {
  garbage: observable,
  treasure: observable
});

const thingStore = new ThingStore();

export default thingStore;
