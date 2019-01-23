export interface IGroup {
  _id: string;
  teacherId: string;
  userId: string;
  name: string;
  startDate: Date | any;
  numberOfClasses: number;
  referentEvents: string[];
  isInfinite?: boolean;
}
