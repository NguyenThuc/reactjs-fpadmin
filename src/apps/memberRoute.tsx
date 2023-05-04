import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { MemberList } from '../components/members';
import { MemberDetail } from '../components/memberDetail';

function MemberRoutes() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <MemberList />
      </Route>
      <Route path={`${match.path}/:id`}>
        <MemberDetail />
      </Route>
    </Switch>
  );
}

export default MemberRoutes;
