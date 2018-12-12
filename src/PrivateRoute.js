import React from "react";
import { observer } from "mobx-react";
import { Route, Redirect } from "react-router-dom";

import authStore from "./store/authStore";

const PrivateRoute = ({
  component: Component,
  authStore,
  redirectUrl,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      authStore.user ? (
        <Component {...props} />
      ) : (
        <Redirect to={redirectUrl || "/"} />
      )
    }
  />
);

export default observer(PrivateRoute);
