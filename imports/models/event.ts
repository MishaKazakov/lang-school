export interface IEvent {
  _id: string;
  auditoryId: string;
  teachersId?: string[];
  groupId?: string;
  name: string;
  date: Date | any;
  day?: number;
  timeStart: number[];
  timeEnd: number[];
  dateCreated?: Date;
  forFuture?: boolean;
  isInfinite?: boolean;
}
