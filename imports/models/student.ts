export interface IStudent {
  _id: string;
  lastName: string;
  firstName: string;
  secondName?: string;
  phone?: string;
  group: {
    [groupId: string]: IStudentGroup;
  };
  archiveGroups?: IStudentGroup[];
}

export interface IStudentGroup {
  _id: string;
  numberLessons: number;
  attended: string[];
  miss: string[];
  canceled: string[];
}
