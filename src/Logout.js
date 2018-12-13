import React from "react";
import { observer } from "mobx-react";

// Stores
import authStore from "./store/authStore";

const Logout = () => {
  return (
    <button className="btn btn-danger" onClick={authStore.logout}>
      Logout {authStore.user.username}
    </button>
  );
};

export default observer(Logout);
