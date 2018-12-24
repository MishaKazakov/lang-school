export interface IEvent {
  _id: string;
  name: string;
  date: Date;
  day?: number;
  group: string;
  timeStart: number[];
  timeEnd: number[];
  auditory: { name?: string, _id?: string };
}
