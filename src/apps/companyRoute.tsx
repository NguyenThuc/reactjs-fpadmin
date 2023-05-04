import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { CompanyDetail } from '../components/companyDetail';
import { CompanyCustomer } from '../components/CompanyCustomer';
import { CompanyGarbage } from '../components/CompanyGarbage';
import { CompanyReportList } from '../components/CompanyReport';


function CompanyRoutes() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/detail`}>
        <CompanyDetail />
      </Route>
      <Route path={`${match.path}/customer-list`}>
        <CompanyCustomer />
      </Route>
      <Route path={`${match.path}/garbage-list`}>
        <CompanyGarbage />
      </Route>
      <Route path={`${match.path}/report-list`}>
        <CompanyReportList />
      </Route>
    </Switch>
  );
}

export default CompanyRoutes;
