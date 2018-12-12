import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { observer } from "mobx-react";

// Store
import authStore from "./store/authStore";

// Components
import Home from "./Home";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Garbage from "./Garbage";
import Treasure from "./Treasure";
import PrivateRoute from "./PrivateRoute";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/garbage" component={Garbage} />
            <PrivateRoute path="/treasure" component={Treasure} />
            <Route path="/signup" component={Signup} />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(observer(App));
