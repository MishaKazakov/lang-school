export interface IEvent {
  _id: string;
  name: string;
  date: Date;
  timeStart: number[];
  timeEnd: number[];
  audience: { name: string };
}
