import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { HistoryList } from '../components/HistoryList';

function NotificationsRoute() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <HistoryList />
      </Route>
      <Route path={match.path}>
        <Redirect to={`${match.path}/list`} />
      </Route>
    </Switch>
  );
}

export default NotificationsRoute;
