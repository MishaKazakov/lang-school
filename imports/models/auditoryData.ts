export interface IAuditoryData {
  _id: string;
  auditory_id: string;
  event_id?: string;
  date: Date;
  occupied: { [hour: number]: number[] };
}
