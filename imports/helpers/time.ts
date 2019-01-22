import * as moment from "moment";

export const formatMomentToDb = date => [date.hours(), date.minutes()];

export const formatDbToMoment = (time: any, date = new Date()) =>
  moment(date).set({
    hours: time[0],
    minutes: time[1]
  });

export const formatDbToDate = (time: any, date = new Date()) =>
  moment(date)
    .set({
      hours: time[0],
      minutes: time[1]
    })
    .toDate();

export const setToMidnight = (date: moment.Moment): Date =>
  moment(date)
    .set({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    })
    .toDate();
