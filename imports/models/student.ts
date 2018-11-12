export interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  miss: number[];
  group: {
    _id: string;
    name: string;
  }[]
}
