import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

// Store
import authStore from "./store/authStore";

// Components
import Login from "./Login";
import Logout from "./Logout";

const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        Navbar
      </Link>
      {authStore.user ? <Logout /> : <Login />}
    </nav>
  );
};

export default observer(Navbar);
