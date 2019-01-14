import { Mongo } from "meteor/mongo";
import { IEventForm, IEvent } from "../models/event";
import { IGroup } from "../models/group";
import { IActivity } from "../models/activity";
import { formatMomentToDb } from "../helpers/time";
import { setNewEventRef, updateEventRef } from "./groups";
import * as moment from "moment";
import { formatDbToDate } from "../helpers/time";

export const Events = new Mongo.Collection("events");

interface IEventOperations {
  data: IEventForm;
  group: IGroup | IActivity;
  date?: Date;
  event?: IEvent;
  referenceable?: boolean;
}

export const createEvent = (eventData: IEventOperations) => {
  const { data, date, referenceable } = eventData;
  const group = <IGroup>eventData.group;
  const timeStart = formatMomentToDb(data.timeStart);
  const timeEnd = formatMomentToDb(data.timeEnd);
  const createRef = referenceable
    ? (err, eventId) => setNewEventRef(group, eventId)
    : null;

  Events.insert(
    {
      name: group.name,
      auditoryId: data.auditoryId,
      teachersId: group.teacherId || data.teachersId,
      groupId: group._id,
      date,
      timeStart,
      timeEnd,
      isInfinite: !group.numberOfClasses,
      beginDate: data.timeStart.toDate(),
      endDate: data.timeEnd.toDate(),
      visible: true,
      day: date.getDay()
    },
    createRef
  );
};

export const updateEvent = (eventData: IEventOperations) => {
  const { data, date, event, referenceable } = eventData;
  const group = <IGroup>eventData.group;
  const timeStart = formatMomentToDb(data.timeStart);
  const timeEnd = formatMomentToDb(data.timeEnd);
  const createRef = referenceable
    ? (err, eventId) => updateEventRef(group, event, eventId)
    : null;

  Events.update(
    { _id: event._id },
    {
      name: group.name,
      auditoryId: data.auditoryId,
      teachersId: group.teacherId || data.teachersId,
      groupId: group._id,
      date,
      timeStart,
      timeEnd,
      isInfinite: !group.numberOfClasses,
      beginDate: data.timeStart.toDate(),
      endDate: data.timeEnd.toDate(),
      visible: true,
      day: date.getDay()
    },
    null,
    createRef
  );
};

export const deleteEvent = (event: IEvent) => {
  Events.update(
    {
      _id: event._id
    },
    { $set: { visible: false } }
  );
};

//trash
export const deleteFutureEvents = (event: IEvent) => {
  const events: any[] = Events.find({
    auditoryId: event.auditoryId,
    teachersId: event.teachersId,
    groupId: event.groupId,
    timeStart: event.timeStart,
    timeEnd: event.timeEnd,
    day: event.day,
    date: {
      $gt: event.date
    }
  }).fetch();

  events.forEach(event => deleteEvent(event));
};

export const cloneEventForThisWeek = (eventId: string, newEventDate: Date) => {
  const event: IEvent = <IEvent>Events.findOne({ _id: eventId });
  const prevDate = moment(event.date);
  const momentDate = moment(newEventDate);
  const daysDifference = momentDate.day() - prevDate.day();
  const date = new Date(newEventDate);

  date.setDate(date.getDate() - daysDifference);

  Events.insert({
    name: event.name,
    auditoryId: event.auditoryId,
    teachersId: event.teachersId,
    groupId: event.groupId,
    date,
    timeStart: event.timeStart,
    timeEnd: event.timeEnd,
    beginDate: formatDbToDate(event.timeStart, date),
    endDate: formatDbToDate(event.timeEnd, date),
    visible: true,
    day: date.getDay()
  });
};

export const areEventsEqual = (event1: IEvent, event2: IEvent) =>
  event1.date.getDay() === event2.date.getDay() &&
  event1.beginDate.getHours() === event2.beginDate.getHours() &&
  event1.beginDate.getMinutes() === event2.beginDate.getMinutes() &&
  event1.endDate.getHours() === event2.endDate.getHours() &&
  event1.endDate.getMinutes() === event2.endDate.getMinutes() &&
  event1.auditoryId === event2.auditoryId;
