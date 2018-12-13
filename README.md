# RJSDemo9 - Authentication - MobX

1.  Walk through the code:

    - Explain what this thing is
    - Explain that the backend has a protected route
    - Show the 401

#### Basic Auth

1. Create `authStore.js`:

```javascript
import { decorate, observable, computed } from "mobx";
import axios from "axios";

class AuthStore {
  constructor() {
    this.user = null;
  }
}

decorate(AuthStore, {
  user: observable
});

const authStore = new AuthStore();

export default authStore;
```

2.  Add a `loginUser` method:

`authStore.js`

```javascript
 loginUser(userData) {
    axios
      .post("https://precious-things.herokuapp.com/login/", userData)
      .then(res => res.data)
      // For now just log user
      .then(user => console.log(user))
      .catch(err => console.error(err.response));
  };
```

3.  Connect method to `Login.js`. Show the token being logged.

```javascript
import {observer} from "mobx-react";
import authStore from "./store/authStore";

...
  handleSubmit(event) {
    event.preventDefault();
    authStore.loginUser(this.state);
  }
...

export default observer(Login);
```

5.  Explain JWT. Install `jwt-decode`. Decode the token. Set the user:

```bash
$ yarn add jwt-decode
```

`authActions.js`

```javascript
...
.then(user => console.log(jwt_decode(user.token)))
...
```

to

```javascript
...
.then(user => {
    const decodedUser = jwt_decode(user.token);
    this.user = decodedUser;
})
...
```

6.  Still not able to make the request! Time to `setAuthToken`:

`authActions.js`

```javascript
setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
  }
  else {
    delete axios.defaults.headers.common.Authorization;
  }
};

...

loginUser(userData) {
    ...
    .then(user => {
        const decodedUser = jwt_decode(user.token);
        this.setAuthToken(user.token);
        this.user = decodedUser;
      })
    ...
}
```

#### Signup

7.  Implement signup action:

`authActions.js`

```javascript
signupUser (userData) {
    axios
      .post("https://precious-things.herokuapp.com/signup/", userData)
      .then(res => res.data)
      .then(user => {
        const decodedUser = jwt_decode(user.token);
        this.setAuthToken(user.token);
        this.user = decodedUser;
      })
      .catch(err => console.error(err.response));
  };
```

8.  Connect to `Signup.js`. This will work BUT THE UX IS BAD (no indication that it worked!):

```javascript
...
handleSubmit(event) {
    event.preventDefault();
    authStore.signupUser(this.state);
}
...

export default observer(Signup);
```

#### UX Features

##### Logout Button

1.  Logout Component:

`Logout.js`

```javascript
import React from "react";
import { observer } from "mobx-react";

import authStore from "./store/authStore";

const Logout = props => {
  return (
    <button className="btn btn-danger" onClick={() => alert("LOGOUT!!")}>
      Logout {authStore.user.username}
    </button>
  );
};

export default observer(Logout);
```

2.  Conditional render:

`Navbar.js`

```javascript
const Navbar = props => {
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
```

3.  Logout method:

`authStore.js`

```javascript
logoutUser() {
  this.user = null;
  this.setAuthToken();
};
```

4.  Wire logout button:

`Logout.js`

```javascript
// Actions
import authStore from "./store/authStore";
...
<button className="btn btn-danger" onClick={authStore.logoutUser}>
    Logout {authStore.user.username}
</button>
...
```

##### DO NOT SHOW USERS THINGS THEY CAN'T USE!

1.  Conditionally render the treasure button:

`Home.js`

```javascript
import authStore from "./store/authStore"

const Home = props => {
  return (
    ...
    {authStore.user && (
    <Link to="/treasure" className="btn btn-lg btn-warning mx-auto">
        TREASURE
    </Link>
    )}
    ...
  );
};
```

##### Redirect after signup

1.  Demonstrate the `history` object in `Singup.js`. Explain where it came from:

```javascript
...
render() {
    const { username, email, password } = this.state;
    console.log(this.props.history);
    ...
}
...
```

to

```javascript
...
render() {
    const { username, email, password } = this.state;
    this.props.history.push('/');
    ...
}
...
```

2.  Modify action to accept `history`:

`authStore.js`

```javascript
signupUser = (userData, history) => {
    ...
      .then(user => {
        const decodedUser = jwt_decode(user.token);
        this.setAuthToken(user.token);
        this.setCurrentUser(decodedUser);
        history.push("/");
      })
    ...
};
```

`Signup.js`

```javascript
class Signup extends Component {
  ...
  handleSubmit(event) {
    event.preventDefault();
    authStore.signupUser(this.state, this.props.history);
  }
  ...
}
```

##### PrivateRoutes

Don't allow users to access pages they can't use! Redirect from private pages!

1.  Private Route:

`PrivateRoute.js`

```javascript
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { observer } from "mobx-react";

import authStore from "./store/authStore";

const PrivateRoute = ({ component: Component, redirectUrl, ...rest }) => {
  if (authStore.user) return <Route {...rest} component={Component} />;
  else return <Redirect to={redirectUrl || "/"} />;
};

export default observer(PrivateRoute);
```

2.  Use private route for pages that require auth:

`App.js`

```javascript
<Switch>
  <Route path="/" exact component={Home} />
  <Route path="/garbage" component={Garbage} />
  <PrivateRoute path="/treasure" component={Treasure} />
  <Route path="/signup" component={Signup} />
  <Redirect to="/" />
</Switch>

export default withRouter(observer(App));

```

##### Persistent Login

If the page refreshes after sign in, I should STILL be signed in!

1.  Store the token in local storage:

`authStore.js`

```javascript
setAuthToken(token) => {
  if (token) {
    localStorage.setItem("treasureToken", token);
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
  }
  ...
};
```

2.  Add an action that checks for a token in `localStorage`:

`authStore.js`

```javascript
checkForExpiredToken() {
    // Check for token expiration
    const token = localStorage.treasureToken;

    if (token) {
      const currentTime = Date.now() / 1000;

      // Decode token and get user info
      const user = jwt_decode(token);

      // Check token expiration
      if (user.exp >= currentTime) {
        // Set auth token header
        this.setAuthToken(token);
        // Set user
        this.setCurrentUser(user);
      } else {
        this.logoutUser();
      }
  };
};
```

3.  Call the action from `componentDidMount` in `App.js`:

```javascript
class App extends Component {
  componentDidMount() {
    authStore.checkToken();
  }
  ...
}

export default observer(App);
```
