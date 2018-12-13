import React from "react";
import { Route, Redirect } from "react-router-dom";
import { observer } from "mobx-react";

import authStore from "./store/authStore";

const PrivateRoute = ({ component: Component, redirectUrl, ...rest }) => {
  if (authStore.user) return <Route {...rest} component={Component} />;
  else return <Redirect to={redirectUrl || "/"} />;
};

export default observer(PrivateRoute);
