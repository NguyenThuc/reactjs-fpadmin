import React, { Fragment, useEffect, useMemo } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import { useSelector } from 'react-redux';
import { _isAdmin, _user } from './store/selectors/App';
import { IUser } from './models/user';
import { checkLogin } from './store/thunks/App';
import { PageLayout } from './components/layout';
import { Banner } from './components/Banner';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import BaseRoute from './apps/baseRoute';
import TaskRoute from './apps/taskRoute';
import NotificationsRoute from './apps/notificationsRoute';
import HistoryRoute from './apps/historyRoute';
import { navigationRef } from './services/navigation';
import PrivacyPolicy from './apps/privacyPolicy';
// import InfomationRoute from './apps/infomationRoute';
import CompanyRoute from './apps/companyRoute';
import MemberRoute from './apps/memberRoute';
import ReportTypeRoute from './apps/reportRoute';
import GarbageTypeRoute from './apps/garbageRoute';
import CustomerRoute from './apps/customerRoute';
import routes from './constants/routes';
import { customeThemeObject } from './theme';
import './style.css';
import { useLocation } from 'react-router-dom';
import Routes from './constants/routes';
import ExportCsvRoute from './apps/exportCsvRoute';

const ContentContainer = ({ children }) => {
  const { pathname } = useLocation();

  const isFullWidth =
    !(
      pathname.includes(routes.TASK_ROUTE) ||
      pathname.includes(routes.BASE_ROUTE) ||
      pathname.includes(routes.INFORMATIOM_ROUTE) ||
      pathname.includes(routes.NOTIFICATIONS_ROUTE) ||
      pathname.includes(routes.EXPORT_CSV) ||
      pathname.includes(routes.HISTORY_ROUTE) ||
      pathname.includes(routes.COMPANY) ||
      pathname.includes(routes.MEMBER) ||
      pathname.includes(routes.REPORTTYPE) ||
      pathname.includes(routes.GARBAGE_TYPE) ||
      pathname.includes(routes.CUSTOMERS)
    ) ||
    pathname.includes(`${routes.TASK_ROUTE}/map`) ||
    (pathname.includes(routes.BASE_ROUTE) &&
      pathname !== `${routes.BASE_ROUTE}/list` &&
      pathname !== `${routes.COMPANY}/customer-list`);

  return (
    <Box
      maxHeight='calc(100% - 71px)'
      height='calc(100% - 71px)'
      display='flex'
      flexDirection='column'
      textAlign='center'
      fontSize='xl'
      id='scrollableDiv'
      bg='body.background'
      overflow={isFullWidth ? 'hidden' : 'auto'}
      {...(isFullWidth
        ? {}
        : {
            paddingLeft: '300px',
            paddingRight: '64px',
          })}
    >
      {children}
    </Box>
  );
};

export const App = () => {
  const customTheme = extendTheme(
    withDefaultColorScheme({
      colorScheme: 'blue',
    }),
    customeThemeObject
  );

  const user: IUser = useSelector(_user);
  const isAdmin: boolean = useSelector(_isAdmin);

  useEffect(() => {
    checkLogin();
  }, []);

  const mainApp = useMemo(() => {
    if (!user)
      return (
        <Switch>
          <Route path={routes.LOGIN}>
            <Login />
          </Route>
          <Route path={routes.PRIVACY_POLICY}>
            <PrivacyPolicy />
          </Route>
          <Route path='*'>
            <Redirect to={routes.LOGIN} />
          </Route>
        </Switch>
      );

    if (!isAdmin) {
      return (
        <Switch>
          <Route path={routes.TASK_ROUTE}>
            <TaskRoute />
          </Route>
          <Route path={routes.LOGIN}>
            <Login />
          </Route>
          <Route path={routes.PRIVACY_POLICY}>
            <PrivacyPolicy />
          </Route>
          {/* <Route path={routes.INFORMATIOM_ROUTE}>
            <InfomationRoute />
          </Route> */}
          {/* <Route path={routes.HOME}>
            <Redirect to='/' />
          </Route> */}
          <Route exact path='/'>
            <Redirect to={routes.TASK_ROUTE} />
          </Route>
          <Route path={routes.NOTIFICATIONS_ROUTE}>
            <NotificationsRoute />
          </Route>
          <Route path='*'>
            <Redirect to={routes.TASK_ROUTE} />
          </Route>
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path={routes.BASE_ROUTE}>
          <BaseRoute />
        </Route>
        <Route path={routes.TASK_ROUTE}>
          <TaskRoute />
        </Route>
        <Route path={routes.NOTIFICATIONS_ROUTE}>
          <NotificationsRoute />
        </Route>
        <Route path={routes.HISTORY_ROUTE}>
          <HistoryRoute />
        </Route>
        <Route path={routes.REPORTS}>
          <div>reports</div>
        </Route>
        <Route path={routes.LOGIN}>
          <Login />
        </Route>
        <Route path={routes.PRIVACY_POLICY}>
          <PrivacyPolicy />
        </Route>
        <Route path={routes.COMPANY}>
          <CompanyRoute />
        </Route>
        <Route path={routes.MEMBER}>
          <MemberRoute />
        </Route>
        <Route path={routes.REPORTTYPE}>
          <ReportTypeRoute />
        </Route>
        <Route path={routes.GARBAGE_TYPE}>
          <GarbageTypeRoute />
        </Route>
        <Route path={routes.CUSTOMERS}>
          <CustomerRoute />
        </Route>
        <Route path={routes.EXPORT_CSV}>
          <ExportCsvRoute />
        </Route>
        {/* <Route path={routes.INFORMATIOM_ROUTE}>
          <InfomationRoute />
        </Route> */}
        {/* <Route path={routes.HOME}>
          <Redirect to='/' />
        </Route> */}
        <Route exact path='/'>
          <Redirect to={routes.TASK_ROUTE} />
        </Route>
        <Route path='*'>
          <Redirect to={routes.TASK_ROUTE} />
        </Route>
      </Switch>
    );
  }, [user, isAdmin]);

  return (
    <ChakraProvider theme={customTheme}>
      <Router ref={navigationRef}>
        <PageLayout>
          <Fragment>
            <Header user={user} />
            <ContentContainer>
              <Banner />
              <Box flex={1} height='100%'>
                {mainApp}
              </Box>
            </ContentContainer>
          </Fragment>
        </PageLayout>
      </Router>
    </ChakraProvider>
  );
};
