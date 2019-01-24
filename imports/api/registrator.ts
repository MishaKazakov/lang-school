import * as moment from "moment";
import { Meteor } from "meteor/meteor";
import { Events } from "./events";
import { Students } from "./students";
import { IEvent } from "../models/event";
import { IStudent } from "../models/student";
import { formatDbToMoment } from "../helpers/time";
import { isIncludes } from "../helpers/events";

const HOUR = 3600000;

export const startRegister = () => {
  registerEvents();
  Meteor.setInterval(registerEvents, HOUR);
};

const events = {};

function registerEvents() {
  const beginDate = moment()
    .minutes(0)
    .toDate();
  const endDate = moment()
    .minutes(59)
    .toDate();

  const thisHourEvents: any[] = Events.find({
    beginDate: {
      $gt: beginDate,
      $lt: endDate
    },
    visible: true
  }).fetch();

  thisHourEvents &&
    thisHourEvents.forEach((event: IEvent) => {
      if (!events[event._id]) {
        events[event._id] = true;
        setEventTimeOut(event);
      }
    });
}

function setEventTimeOut(event: IEvent) {
  const timeEnd: any = formatDbToMoment(event.timeEnd);
  const currentTime: any = moment();
  const timer: number = currentTime - timeEnd;

  Meteor.setTimeout(() => checkEventAttendance(event), timer);
}

function checkEventAttendance(event: IEvent) {
  const eventId = event._id;
  const groupId = event.groupId;
  const studentsInGroup = Students.find({
    [`group.${groupId}`]: { $exists: true }
  }).fetch();

  studentsInGroup.forEach((student: IStudent) => {
    const group = student.group[groupId];

    if (
      !isIncludes(group.attended, eventId) &&
      !isIncludes(group.canceled, eventId) &&
      !isIncludes(group.miss, eventId)
    ) {
      group.attended.push({ id: eventId, date: event.date });

      student.group[groupId] = group;
      Students.update(
        { _id: student._id },
        { ...student },
        null,
        checkStudentGroups
      );
    }
  });

  delete events[event._id];
}

function checkStudentGroups(studentId: string) {
  const student: IStudent = <IStudent>Students.findOne({ _id: studentId });

  for (const groupId in student.group) {
    const group = student.group[groupId];
    const { numberLessons, attended, miss } = group;

    if (numberLessons - attended.length - miss.length === 0) {
      Students.update(
        { _id: student._id },
        {
          $unset: {
            [`group.${group._id}`]: ""
          },
          $push: {
            archiveGroups: group
          }
        }
      );
    }
  }
}
