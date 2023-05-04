import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { ExportCsv } from '../components/ExportCsv';

function MemberRoutes() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}`}>
        <ExportCsv />
      </Route>
    </Switch>
  );
}

export default MemberRoutes;
