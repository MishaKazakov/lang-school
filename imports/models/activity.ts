export interface IActivity {
  _id: string;
  name: string;
  date: Date;
  timeStart: number[];
  timeEnd: number[];
  employees: { _id?: string; firstName?: string; lastName?: string }[];
  auditory: { name?: string; _id?: string };
}
