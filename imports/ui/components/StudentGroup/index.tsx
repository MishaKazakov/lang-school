import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

const StudentGroup = ({students, title, onClick}) => (
  <div className={cx("student-group")}>
    <div className={cx("student-group__title")}>{title}</div>
    {students.map(student => (
      <div key={student._id} className={cx("student-group__wrapper")}>
        <div
          data-id={student._id}
          onClick={onClick}
          className={cx("student-group__student")}
        >
          {`${student.fistName} ${student.lastName}`}
        </div>
      </div>
    ))}
  </div>
);

export default StudentGroup;
