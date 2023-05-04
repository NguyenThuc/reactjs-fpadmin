import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { CustomerList } from '../components/CustomerList';

function CustomerRoute() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <CustomerList />
      </Route>
    </Switch>
  );
}

export default CustomerRoute;
