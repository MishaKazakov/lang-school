import { Mongo } from "meteor/mongo";
import { IGroup } from "../models/group";
import { IActivity } from "../models/activity";
import { IEvent } from "../models/event";
import { Events, areEventsEqual } from "./events";
import { Activities } from "./activities";

export const Groups = new Mongo.Collection("groups");

export const setNewEventRef = (
  eventGroup: IGroup | IActivity,
  eventId: string
) => {
  const group = { ...eventGroup };

  if (!group.referentEvents) {
    group.referentEvents = [];
  }

  group.referentEvents.push(eventId);
  if ((<IGroup>eventGroup).startDate) {
    Groups.update({ _id: group._id }, { ...group });
  } else {
    Activities.update({ _id: group._id }, { ...group });
  }
};

export const updateEventRef = (
  eventGroup: IGroup | IActivity,
  prevEvent: IEvent,
  nextEventId
) => {
  let oldRefId;
  const group = { ...eventGroup };
  const refEvents: IEvent[] = <IEvent[]>Events.find({
    _id: group.referentEvents
  }).fetch();

  refEvents.forEach(event => {
    if (areEventsEqual(event, prevEvent)) {
      oldRefId = event._id;
    }
  });

  const oldRefIndex = group.referentEvents.indexOf(oldRefId);
  group.referentEvents.splice(oldRefIndex, 1, nextEventId);

  if ((<IGroup>eventGroup).startDate) {
    Groups.update({ _id: group._id }, { ...group });
  } else {
    Activities.update({ _id: group._id }, { ...group });
  }
};
