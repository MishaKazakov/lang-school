export interface IEvent {
  name: string;
  date: Date;
  timeStart: number[];
  timeEnd: number[];
  audience: { name: string };
}
