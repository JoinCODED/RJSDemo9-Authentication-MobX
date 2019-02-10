import React from "react";
import { observer } from "mobx-react";

import authStore from "./store/authStore";

const Logout = () => (
  <button className="btn btn-danger" onClick={() => authStore.logout()}>
    Logout {authStore.user.username}
  </button>
);

export default observer(Logout);
