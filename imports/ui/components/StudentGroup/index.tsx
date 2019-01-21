import * as React from "react";
import { IStudent } from "../../../models/student";
const cx = require("classnames/bind").bind(require("./style.scss"));

const Icon = require("antd/lib/icon");

interface IProps {
  students: IStudent[];
  title: string;
  onLeftClick?: (id: string) => void;
  onRightClick?: (id: string) => void;
}

class StudentGroup extends React.Component<IProps> {
  render() {
    const { students, title, onLeftClick, onRightClick } = this.props;

    return (
      <div className={cx("student-group")}>
        <div className={cx("student-group__title")}>{title}</div>
        {students.map(student => {
          const toLeft = () => onLeftClick(student._id);
          const toRight = () => onRightClick(student._id);

          return (
            <div key={student._id} className={cx("student-group__wrapper")}>
              <Icon
                type="left"
                onClick={toLeft}
                className={cx("student-group__icon-button")}
              />
              <div className={cx("student-group__student")}>
                {student.firstName} {student.lastName}
              </div>
              <Icon
                type="right"
                onClick={toRight}
                className={cx("student-group__icon-button")}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default StudentGroup;
