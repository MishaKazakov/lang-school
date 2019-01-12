import { Mongo } from "meteor/mongo";
import { IGroup } from "../models/group";
import { IEvent } from "../models/event";
import { Events, areEventsEqual } from "./events";

export const Groups = new Mongo.Collection("groups");

export const setNewEventRef = (eventGroup: IGroup, eventId: string) => {
  const group = { ...eventGroup };

  if (!group.referentEvents) {
    group.referentEvents = [];
  }

  group.referentEvents.push(eventId);
  Groups.update({ _id: group._id }, { ...group });
};

export const updateEventRef = (
  eventGroup: IGroup,
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
  Groups.update({ _id: group._id }, { ...group });
};
