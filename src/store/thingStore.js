import { decorate, observable } from "mobx";
import axios from "axios";

class ThingStore {
  garbage = [];

  treasure = [];

  fetchGarbage = async () => {
    try {
      const res = await axios.get(
        "https://precious-things.herokuapp.com/api/things/"
      );
      const things = res.data;
      this.garbage = things;
    } catch (err) {
      console.error(err);
    }
  };

  fetchTreasure = async () => {
    try {
      const res = await axios.get(
        "https://precious-things.herokuapp.com/api/private-things/"
      );
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
