import { Mongo } from "meteor/mongo";
import { ITeacher, ITeacherForm } from "../models/teacher";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

export const Teachers = new Mongo.Collection("teachers");

const defaultPassword = "password";
const teacherRole = "teacher";

Meteor.methods({
  createTeacher: (data: ITeacherForm) => createTeacher(data)
});

Meteor.methods({
  updateTeacher: (_id: string, data: ITeacherForm) => updateTeacher(_id, data)
});

const createTeacher = (data: ITeacherForm) => {
  if (Meteor.isServer) {
    const email = data.email;

    const existUser = Accounts.findUserByEmail(email);

    if (existUser) {
      throw new Meteor.Error("userExists");
    }

    Accounts.createUser({
      email: email,
      password: defaultPassword,
      profile: { role: teacherRole }
    });

    const userId = (Accounts.findUserByEmail(email) as { _id: string })._id;

    Teachers.insert({
      firstName: data.firstName,
      secondName: data.secondName,
      lastName: data.lastName,
      phone: data.phone,
      userId: userId
    });

    return defaultPassword;
  }
};

const updateTeacher = (_id: string, data: ITeacherForm) => {
  if (Meteor.isServer) {
    Teachers.update(
      { _id },
      {
        firstName: data.firstName,
        secondName: data.secondName,
        lastName: data.lastName,
        phone: data.phone
      }
    );

    const teacher = Teachers.findOne(_id) as ITeacher;
    const user = Meteor.users.find(teacher.userId) as {
      _id: string;
      emails: { address: string }[];
    };
    const newEmail = data.email;
    const oldEmail = user.emails[0].address;

    if (newEmail === oldEmail) return;

    Accounts.addEmail(user._id, newEmail);
    Accounts.removeEmail(user._id,oldEmail);
  }
};
