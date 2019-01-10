import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

// Logo
import logo from "./assets/theindex.svg";

class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar">
        <img src={logo} className="logo" alt="the index logo" />
        <section>
          <h4 className="menu-item">
            <NavLink to="/authors">AUTHORS</NavLink>
          </h4>
          <h4 className="menu-item">
            <NavLink to="/books">BOOKS</NavLink>
          </h4>
        </section>
        <Link to="/login" className="fixed-bottom m-3">
          <button className="btn btn-default">Login</button>
        </Link>
      </div>
    );
  }
}

export default Sidebar;
