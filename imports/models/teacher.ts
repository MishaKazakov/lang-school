export interface ITeacher {
  _id: string;
  lastName: string;
  secondName?: string;
  firstName: string;
  phone?: string;
  language?: string[];
  userId: string;
}

export interface ITeacherForm {
  _id: string;
  lastName: string;
  secondName?: string;
  firstName: string;
  phone?: string;
  language?: string[];
  email: string;
}