import React, { Component } from "react";
import { observer } from "mobx-react";

// Stores
import authStore from "./stores/authStore";

class Logout extends Component {
  render() {
    return (
      <button className="btn btn-danger" onClick={() => authStore.logout()}>
        Logout {authStore.user.username}
      </button>
    );
  }
}

export default observer(Logout);
