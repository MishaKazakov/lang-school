import * as moment from "moment";

export interface IEvent {
  _id: string;
  auditoryId: string;
  teachersId?: string[];
  groupId?: string;
  name: string;
  date: Date;
  day?: number;
  beginDate?: Date;
  endDate?: Date;
  timeStart: number[];
  timeEnd: number[];
  dateCreated?: Date;
  isActivity: boolean;
}

export interface IEventForm {
  _id: string;
  auditoryId: string;
  teachersId?: string[];
  groupId?: string;
  name: string;
  date: moment.Moment;
  day?: number;
  beginDate?: moment.Moment;
  endDate?: moment.Moment;
  timeStart: number[] | any;
  timeEnd: number[] | any;
  forFuture?: boolean;
  visible?: boolean;
}
