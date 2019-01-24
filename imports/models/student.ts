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
  modifiedAt?: Date;
}

export interface IStudentGroup {
  _id: string;
  numberLessons: number;
  attended: IStatus[];
  miss: IStatus[];
  canceled: IStatus[];
  purchaseDate: Date;  
}

export interface IStatus {
  id: string;
  date: Date;
}
