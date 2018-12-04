import * as React from "react";
import { IStudent } from "../../../models/student";
const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  students: IStudent[];
  title: string;
  onClick?: (event?: React.SyntheticEvent<any>) => void;
}

class StudentGroup extends React.Component<IProps> {
  render() {
    const { students, title, onClick } = this.props;

    return (
      <div className={cx("student-group")}>
        <div className={cx("student-group__title")}>{title}</div>
        {students.map(student => (
          <div key={student._id} className={cx("student-group__wrapper")}>
            <div
              data-id={student._id}
              onClick={onClick}
              className={cx("student-group__student")}
            >
              {student.firstName} {student.lastName}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default StudentGroup;
