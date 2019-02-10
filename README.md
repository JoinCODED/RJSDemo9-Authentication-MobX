# RJSDemo8 - Authentication - MobX

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
  user = null;
}

decorate(AuthStore, {
  user: observable
});

const authStore = new AuthStore();

export default authStore;
```

2. Add a `signupUser` method:

`authStore.js`

```javascript
signup = async userData => {
  try {
    const res = await axios.post(
      "https://precious-things.herokuapp.com/signup/",
      userData
    );
    const user = res.data;
    console.log(user);
  } catch (err) {
    console.error(err.response.data);
  }
};
```

3.  Connect method to `Signup.js`. Show the token being logged.

```javascript
...
handleSubmit = event => {
    event.preventDefault();
    authStore.signup(this.state);
}
...
```

4. Explain JWT. Install `jwt-decode`. Decode the token. Set the user:

```bash
$ yarn add jwt-decode
```

`authStore.js`

```javascript
...
const user = res.data;
console.log(jwt_decode(user));
...
```

5. Create and use a `setUser` method:

```javascript
setUser = (token) => {
  const decodedUser = jwt_decode(token);
  this.user = decodedUser;
}
...
const user = res.data;
this.setUser(user.token);
})
...
```

5.  Still not able to make the request! Time to set the axios authentication header in `setUser`:

`authActions.js`

```javascript
setUser = token => {
  if (token) {
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
    const decodedUser = jwt_decode(token);
    this.user = decodedUser;
  }
  else {
    delete axios.defaults.headers.common.Authorization;
  }
};
...
```

#### Login

7.  Add a `login` method:

`authActions.js`

```javascript
login = async userData => {
  try {
    const res = await axios.post(
      "https://precious-things.herokuapp.com/signup/",
      userData
    );
    const user = res.data;
    this.setUser(user.token);
  } catch (err) {
    console.error(err.response.data);
  }
};
```

8.  Connect to `Login.js`. This will work BUT THE UX IS BAD (no indication that it worked!):

```javascript
...
handleSubmit = event => {
    event.preventDefault();
    authStore.login(this.state);
}
...
```

#### UX Features

##### Logout Button

1.  Logout Component:

`Logout.js`

```javascript
import React from "react";
import { observer } from "mobx-react";

import authStore from "./store/authStore";

const Logout = () => {
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
setUser = token => {
  if (token) {
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
    const decodedUser = jwt_decode(token);
    this.user = decodedUser;
  }
  else {
    delete axios.defaults.headers.common.Authorization;
    this.user = null;
  }
};
...
logout = () => {
  this.setUser();
};
```

4.  Wire logout button:

`Logout.js`

```javascript
// Actions
import authStore from "./store/authStore";
...
<button className="btn btn-danger" onClick={authStore.logout}>
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

export default observer(Home);
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

2.  Modify action to accept `history`:

`authStore.js`

```javascript
signup = async (userData, history) => {
  try {
    const res = axios.post(
      "https://precious-things.herokuapp.com/signup/",
      userData
    );
    const user = res.data;
    this.setUser(user.token);
    history.replace("/");
  } catch (err) {
    console.error(err.response.data);
  }
};
```

`Signup.js`

```javascript
class Signup extends Component {
  ...
  handleSubmit = event => {
    event.preventDefault();
    authStore.signupUser(this.state, this.props.history);
  }
  ...
}
```

##### Private and Public ONLY Pages

Don't allow users to access pages they can't use! Redirect from private and public ONLY pages!

1.  Redirect from `/treasure` :

`Treasure.js`

```javascript
...
render() {
  ...
  if (!authStore.user) return <Redirect to="/login" />;
  ...
}
...
```

2.  Redirect from `Signup.js`:

`Signup.js`

```javascript
...
render() {
  ...
  if (authStore.user) return <Redirect to="/" />;
  ...
}
...
```

##### Persistent Login

If the page refreshes after sign in, I should STILL be signed in!

1.  Store the token in local storage:

`authStore.js`

```javascript
setUser = token => {
  if (token) {
    localStorage.setItem("myToken", token);
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
    const decodedUser = jwt_decode(token);
    this.user = decodedUser;
  } else {
    delete axios.defaults.headers.common.Authorization;
    localStorage.removeItem("myToken");
    this.user = null;
  }
};
```

2.  Add an action that checks for a token in `localStorage`:

`authStore.js`

```javascript
checkForExpiredToken = () => {
  const token = localStorage.getItem("myToken");
  if (token) {
    const currentTime = Date.now() / 1000;
    const user = jwt_decode(token);
    if (user.exp >= currentTime) {
      this.setUser(token);
    } else {
      this.logout();
    }
  }
};
```

3.  Call the method before exporting the store in `authStore.js`:

```javascript
const authStore = new AuthStore();
authStore.checkForToken();

export default authStore;
```
