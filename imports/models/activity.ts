export interface IActivity {
  _id: string;
  name: string;
  numberOfClasses: number;
  isInfinite?: boolean;
  referentEvents: string[];
}
