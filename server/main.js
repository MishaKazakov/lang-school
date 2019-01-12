import { Meteor } from "meteor/meteor";
import "../imports/api/events";
import "../imports/api/auditories";
import "../imports/api/teachers";
import "../imports/api/groups";
import "../imports/api/activities";
import "../imports/api/students";
import "../imports/api/registrator";
import { startRegister } from "../imports/api/registrator";
import { startPermanentEventObserver } from "../imports/api/permamentEvents";

Meteor.startup(() => {
  // code to run on server at startup
  startRegister();
  startPermanentEventObserver();
});
