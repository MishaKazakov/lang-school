import { IEvent } from "../models/event";
import * as moment from "moment";
import { setToMidnight } from "./time";

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
}

export function getEventsQuery(data: IEventQuery) {
  const { date: dataDate, auditoryId, teacherId, _id } = data;
  const teachersId = Array.isArray(teacherId) ? { $in: teacherId } : teacherId;
  let date;
  if (Array.isArray(dataDate)) {
    const dates = dataDate.map(newDate => setToMidnight(newDate));
    date = { $in: dates };
  } else {
    date = setToMidnight(dataDate);
  }

  return {
    date,
    _id: { $ne: _id },
    $or: [{ auditoryId }, { teachersId: teachersId }]
  };
}
