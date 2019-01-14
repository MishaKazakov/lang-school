import { Meteor } from "meteor/meteor";
import { Events, cloneEventForThisWeek, areEventsEqual } from "./events";
import { IGroup } from "../models/group";
import { IEvent } from "../models/event";
import { Groups } from "./groups";
import { Activities } from "./activities";
import * as moment from "moment";

const WEEK = 604800000;

export const startPermanentEventObserver = () =>
  Meteor.setInterval(permanentEventObserver, WEEK);

const permanentEventObserver = () => {
  const groups: IGroup[] = <IGroup[]>Groups.find({ isInfinite: true }).fetch();
  const activities = <IGroup[]>Activities.find({ isInfinite: true }).fetch();
  groups.concat(activities);
  const monday = moment().startOf("week");
  const sunday = monday.clone().day(7);

  groups &&
    groups.forEach(group => {
      const refEventNum = group.referentEvents.length;

      if (!group.referentEvents || refEventNum === 0) return;

      const events: IEvent[] = <IEvent[]>Events.find({
        date: {
          $gt: monday.toDate(),
          $lt: sunday.toDate()
        },
        groupId: group._id
      }).fetch();

      if (events.length === refEventNum) {
        return;
      }

      if (events.length != refEventNum) {
        if (events.length === 0) {
          addAllEvents(group.referentEvents);
        } else {
          addMissingEvents(group.referentEvents, events);
        }
      }
    });
};

const addAllEvents = (referentEvents: string[]) => {
  referentEvents.forEach(refEventId => {
    add10FutureEvents(refEventId);
  });
};

const addMissingEvents = (referentEventsIds: string[], events: IEvent[]) => {
  const referentEvents: IEvent[] = <IEvent[]>Events.find({
    _id: {
      $in: referentEventsIds
    }
  }).fetch();
  const matchedEvents = {};

  referentEvents.forEach(refEvent => (matchedEvents[refEvent._id] = true));

  events.forEach(event => {
    referentEvents.forEach(refEvent => {
      if (areEventsEqual(event, refEvent)) {
        matchedEvents[refEvent._id] = false;
      }
    });
  });

  for (const refEventId in matchedEvents) {
    matchedEvents[refEventId] && add10FutureEvents(refEventId);
  }
};

const add10FutureEvents = (refEventId: string) => {
  const date = new Date();
  for (let i = 0; i < 10; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 7 * i);
    cloneEventForThisWeek(refEventId, nextDate);
  }
};
