import * as React from "react";
import Layout from "../../components/Layout";
import StudentGroup from "../../components/StudentGroup";
import { IStudent } from "../../../models/student";
import { formatTime } from "../../../helpers/string";

const cx = require("classnames/bind").bind(require("./style.scss"));

const event = {
  _id: "1",
  name: "Английский",
  attended: ["1"],
  missed: [],
  date: new Date(),
  timeStart: [10, 30],
  timeEnd: [12, 0]
};

const students = [
  {
    _id: "1",
    fistName: "Дима",
    lastName: "Васнецов",
    miss: []
  },
  {
    _id: "2",
    fistName: "Вася",
    lastName: "Савельев",
    miss: []
  },
  {
    _id: "3",
    fistName: "Евгений",
    lastName: "Онегин ",
    miss: []
  },
  {
    _id: "4",
    fistName: "Захар",
    lastName: "Медведев",
    miss: [1]
  }
];

class Attendance extends React.Component {
  mapGroup = (students: IStudent[], event) => {
    const group = [];
    const attended = [];
    const missed = [];

    students.forEach(student => {
      if (event.attended.includes(student._id)) {
        attended.push(student);
      } else if (event.missed.includes(student._id)) {
        missed.push(student);
      } else {
        group.push(student);
      }
    });

    return { group, attended, missed };
  };

  onClick = e => {
    const id = e.target.dataset.id;
    this.changeStudentStatus(id);
    this.forceUpdate();
  };

  changeStudentStatus = (id: string) => {
    if (event.attended.includes(id)) {
      const position = event.attended.indexOf(id);
      event.attended.splice(position, 1);
      event.missed.push(id);
      return;
    }

    if (event.missed.includes(id)) {
      const position = event.missed.indexOf(id);
      event.missed.splice(position, 1);
      return;
    }

    event.attended.push(id);
  };

  render() {
    const { group, attended, missed } = this.mapGroup(students, event);
    const time = formatTime(event.timeStart);
    const d = event.date;
    const day = `${d.getDay()}.${d.getMonth() + 1}.${d.getFullYear()}`;

    return (
      <Layout title={`Отметка посещаемости ${event.name}`}>
        <div className={cx("attendance")}>
          <div className={cx("attendance__day")}>Дата: {day}</div>
          <div className={cx("attendance__day")}>Время: {time}</div>
          <div className={cx("attendance__groups")}>
            <StudentGroup
              onClick={this.onClick}
              title="Студенты в группе"
              students={group}
            />
            <StudentGroup
              onClick={this.onClick}
              title="Пришли"
              students={attended}
            />
            <StudentGroup
              onClick={this.onClick}
              title="Отменили"
              students={missed}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default Attendance;
