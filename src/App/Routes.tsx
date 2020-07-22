import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from 'pages/Auth/Login';
import Todo from 'pages/Todo';
import { getStoredAuthToken } from 'shared/utils/authToken';

type Props = {
  component: any;
  path: string;
};

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const token = getStoredAuthToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};

const LoginRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const token = getStoredAuthToken();
  return (
    <Route
      {...rest}
      render={(props) => (!token ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Redirect exact from="/" to="/todo" />
      <LoginRoute path="/login" component={Login} />
      <PrivateRoute path="/todo" component={Todo} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
