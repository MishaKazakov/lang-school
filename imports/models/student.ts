export interface IStudent {
  _id: string;
  lastName: string;
  firstName: string;
  secondName?: string;
  miss: number[];
  group: {
    _id: string;
    name: string;
  }[];
}
