import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Main from '../ui/pages/Main';
import Students from '../ui/pages/Students';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
  <Switch>
    <Route exact path="/" component={Main}/>
    <Route exact path="/students" component={Students}/>
  </Switch>
  </Router>
);