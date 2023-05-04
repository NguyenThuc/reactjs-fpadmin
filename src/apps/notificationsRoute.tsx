import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { NotificationDetails } from '../components/NotificationDetails';
import { NotificationsList } from '../components/NotificationsList';

function NotificationsRoute() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <NotificationsList />
      </Route>
      <Route path={`${match.path}/:id`}>
        <NotificationDetails />
      </Route>
      <Route path={match.path}>
        <Redirect to={`${match.path}/list`} />
      </Route>
    </Switch>
  );
}

export default NotificationsRoute;
