import React from "react";
import { Router, Route, Switch } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import { createStore } from "redux";
import { Provider } from "react-redux";

import Main from "../ui/pages/Main";
import Students from "../ui/pages/Students";
import Attendance from "../ui/pages/Attendance";

import reducer from "../ui/reducers/reducer";

const store = createStore(reducer);
const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Switch>
        <Route
          exact
          path="/(group|audience|teacher|event|online)?"
          component={Main}
        />
        <Route exact path="/students" component={Students} />
        <Route exact path="/attendance" component={Attendance} />
      </Switch>
    </Router>
  </Provider>
);
