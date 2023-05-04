import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { ReportTypeList } from '../components/ReportTypeList';

function MemberRoutes() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <ReportTypeList />
      </Route>
    </Switch>
  );
}

export default MemberRoutes;
