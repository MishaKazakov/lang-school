import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { IUser } from "../models/user";

const defaulAdminAcc = {
  email: "admin@admin.com",
  password: "qwerty",
  profile: { role: "admin" }
};

const CreateDefultAdmin = () => {
  if (!Meteor.users.find({ profile: { role: "admin" } }).count())
    Accounts.createUser(defaulAdminAcc);
};

export const ConfigureUserAccounts = () => {
  CreateDefultAdmin();
};

Meteor.methods({
  getUserEmail: id => {
    if (Meteor.isServer) {
      const user = Meteor.users.findOne(id) as IUser;
      const email = user && user.emails[0].address;
      return email;
    }
  }
});
