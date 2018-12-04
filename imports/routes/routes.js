import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Main from '../ui/pages/Main';
import Students from '../ui/pages/Students';
import Attendance from '../ui/pages/Attendance';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
  <Switch>
    <Route exact path="/(group|audience|teacher|event|online)?" component={Main}/>
    <Route exact path="/students" component={Students}/>
    <Route exact path="/attendance" component={Attendance}/>
  </Switch>
  </Router>
);