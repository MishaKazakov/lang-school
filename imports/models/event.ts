export interface IEvent {
  _id: string;
  auditoryId: string;
  name: string;
  date: Date;
  day?: number;
  group?: string;
  timeStart: number[];
  timeEnd: number[];
}
