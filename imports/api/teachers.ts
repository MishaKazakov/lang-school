import { Mongo } from "meteor/mongo";
import { ITeacher, ITeacherForm } from "../models/teacher";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { IUser } from "../models/user";

export const Teachers = new Mongo.Collection("teachers");

const defaultPassword = "password";
const teacherRole = "teacher";

Meteor.methods({
  createTeacher: (data: ITeacherForm) => createTeacher(data)
});

Meteor.methods({
  updateTeacher: (_id: string, data: ITeacherForm) => updateTeacher(_id, data)
});

Meteor.methods({
  removeTeacher: (_id: string) => removeTeacher(_id)
});

const createTeacher = (data: ITeacherForm) => {
  if (Meteor.isServer) {
    const userId = Accounts.createUser({
      email: data.email,
      password: defaultPassword,
      profile: { role: teacherRole }
    });

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
    const teacher = Teachers.findOne({ _id }) as ITeacher;
    const user = Meteor.users.findOne({ _id: teacher.userId }) as IUser;

    Teachers.update(
      { _id },
      {
        firstName: data.firstName,
        secondName: data.secondName,
        lastName: data.lastName,
        phone: data.phone,
        userId: user._id
      }
    );

    const newEmail = data.email;
    const oldEmail = user.emails[0].address;

    if (newEmail !== oldEmail) {
      Accounts.addEmail(user._id, newEmail);
      Accounts.removeEmail(user._id, oldEmail);
    }
  }
};

const removeTeacher = (_id: string) => {
  const teacher = Teachers.findOne({ _id }) as ITeacher;
  const user = Meteor.users.findOne({ _id: teacher.userId }) as IUser;

  Teachers.remove({ _id });
  Meteor.users.remove({ _id: user._id });
};
