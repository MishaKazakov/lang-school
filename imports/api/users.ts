import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

const defaulAdminAcc = {
  email: "admin@admin",
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
      const user = Meteor.users.findOne(id);
      const email =
        user && (user as { emails: { address: string }[] }).emails[0].address;
      return email;
    }
  }
});
