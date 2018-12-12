import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import authStore from "./store/authStore";

const Home = () => {
  return (
    <div className="row d-flex align-items-center" style={{ height: "80vh" }}>
      <Link to="/garbage" className="btn btn-lg btn-outline-secondary mx-auto">
        Random Garbage
      </Link>
      {authStore.user && (
        <Link to="/treasure" className="btn btn-lg btn-warning mx-auto">
          TREASURE
        </Link>
      )}
    </div>
  );
};

export default observer(Home);
