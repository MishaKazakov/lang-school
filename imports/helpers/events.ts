import { IEvent } from "../models/event";
import * as moment from "moment";
import { setToMidnight } from "./time";
import { IStatus } from "../models/student";

export function eventsToDisabledTimes(events: IEvent[]) {
  const times = {};

  if (!events) {
    return;
  }

  events.forEach(event => {
    const start = event.timeStart;
    const end = event.timeEnd;

    if (!times[start[0]]) {
      times[start[0]] = [];
    }

    if (!times[end[0]]) {
      times[end[0]] = [];
    }

    if (start[0] === end[0]) {
      times[start[0]].push([start[1], end[1]]);
    } else {
      times[start[0]].push([start[1], 60]);
      times[end[0]].push([0, end[1]]);
    }

    if (end[0] - start[0] > 1) {
      for (let i = start[0] + 1; i < end[0]; i++) {
        if (!times[i]) {
          times[i] = [];
        }
        times[i].push([0, 60]);
      }
    }
  });

  return times;
}

interface IEventQuery {
  date: moment.Moment | moment.Moment[];
  auditoryId: string;
  teacherId: string;
  _id?: string;
  numClasses: number;
}

export function getEventsQuery(data: IEventQuery) {
  const { date: dataDate, auditoryId, teacherId, _id, numClasses } = data;
  const teachersId = Array.isArray(teacherId) ? { $in: teacherId } : teacherId;
  let date;

  if (Array.isArray(dataDate)) {
    let dates = [];
    dataDate.forEach(newDate => {
      const nextDays = getNextDays(numClasses, newDate);
      dates = dates.concat(nextDays);
    });
    date = { $in: dates };
  } else {
    const dates = getNextDays(numClasses, dataDate);
    date = { $in: dates };
  }

  return {
    date,
    _id: { $ne: _id },
    $or: [{ auditoryId }, { teachersId: teachersId }]
  };
}

const getNextDays = (numWeeks, date) =>
  Array.from({ length: numWeeks }, (v, i) => {
    const nextDate = moment(date);
    nextDate.add(7 * i, "days");
    return setToMidnight(nextDate);
  });

export function getNearestEvent(startTime: Date, events: any[]) {
  let nearestEvent;
  let timeSegment = 86400000;

  events.forEach((event: IEvent) => {
    const timeDif = event.beginDate.getTime() - startTime.getTime();
    if (timeDif > 0 && timeDif < timeSegment) {
      nearestEvent = event;
      timeSegment = timeDif;
    }
  });

  return nearestEvent;
}

export const isIncludes = (subGroup: IStatus[], id: string) =>
  subGroup.some((group: IStatus) => group.id === id);
