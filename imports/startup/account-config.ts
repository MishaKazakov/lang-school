import { Meteor } from "meteor/meteor";

Meteor.users.deny({ update: () => true });
