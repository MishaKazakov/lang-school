import React from "react";
import { Router, Route, Switch } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import { createStore } from "redux";
import { Provider } from "react-redux";

const LocaleProvider = require("antd/lib/locale-provider");
import ru_RU from "antd/lib/locale-provider/ru_RU";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

import Main from "../ui/pages/Main";
import Students from "../ui/pages/Students";
import Attendance from "../ui/pages/Attendance";

import reducer from "../ui/reducers/reducer";

const store = createStore(reducer);
const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Provider store={store}>
    <LocaleProvider locale={ru_RU}>
      <Router history={browserHistory}>
        <Switch>
          <Route
            exact
            path="/(group|auditory|teacher|event|online)?"
            component={Main}
          />
          <Route exact path="/students" component={Students} />
          <Route exact path="/attendance" component={Attendance} />
        </Switch>
      </Router>
    </LocaleProvider>
  </Provider>
);
