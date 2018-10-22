import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import {renderRoutes } from "../imports/routes/routes.js";

import "./main.html";

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
