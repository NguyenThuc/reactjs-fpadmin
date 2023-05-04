import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { GarbageTypeList } from '../components/GarbageTypeList';

function GarbageRoute() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <GarbageTypeList />
      </Route>
    </Switch>
  );
}

export default GarbageRoute;
