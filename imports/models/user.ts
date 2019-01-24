export interface IUser {
  _id: string;
  emails: { address: string }[];
  profile: { role: string };
}
