export interface IEvent {
  _id: string;
  name: string;
  date: Date;
  group: string;
  timeStart: number[];
  timeEnd: number[];
  audience: { name: string };
}
