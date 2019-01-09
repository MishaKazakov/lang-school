import * as moment from "moment";
import { Meteor } from "meteor/meteor";
import { Events } from "./events";
import { Students } from "./students";
import { IEvent } from "../models/event";
import { IStudent } from "../models/student";
import { formatDbToMoment } from "../helpers/time";

const HOUR = 3600000;

export const startRegister = () => Meteor.setInterval(registerEvents, HOUR);

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
    }
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
      !group.attended.includes(eventId) &&
      !group.canceled.includes(eventId)
    ) {
      group.miss.push(eventId);
      student.group[groupId] = group;
      Students.update({ _id: student._id }, { ...student });
    }
  });

  delete events[event._id];
}
