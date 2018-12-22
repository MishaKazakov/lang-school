import * as React from "react";
import Layout from "../../components/Layout";
import StudentGroup from "../../components/StudentGroup";
import { IStudent } from "../../../models/student";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";

const cx = require("classnames/bind").bind(require("./style.scss"));

const event: IEvent = {
  _id: "1",
  name: "Английский",
  group: "abc",
  date: new Date(),
  timeStart: [10, 30],
  timeEnd: [12, 0],
  auditory: { name: "Нью-йорк" }
};

let students: IStudent[] = [
  {
    _id: "1",
    firstName: "Дима",
    lastName: "Васнецов",
    group: {
      abc: {
        _id: "abc",
        name: "Английский",
        miss: [],
        attended: [],
        canceled: [],
        numberLessons: 5
      }
    }
  },
  {
    _id: "2",
    firstName: "Вася",
    lastName: "Савельев",
    group: {
      abc: {
        _id: "abc",
        name: "Английский",
        miss: [],
        attended: [],
        canceled: [],
        numberLessons: 5
      }
    }
  },
  {
    _id: "3",
    firstName: "Евгений",
    lastName: "Онегин ",
    group: {
      abc: {
        _id: "abc",
        name: "Английский",
        miss: [],
        attended: [],
        canceled: [],
        numberLessons: 5
      }
    }
  },
  {
    _id: "4",
    firstName: "Захар",
    lastName: "Медведев",
    group: {
      abc: {
        _id: "abc",
        name: "Английский",
        miss: [],
        attended: [],
        canceled: ["1"],
        numberLessons: 5
      }
    }
  }
];

class Attendance extends React.Component {
  mapGroup = (students: IStudent[], event) => {
    const group = [];
    const attended = [];
    const canceled = [];
    const groupId: string = event.group;
    const eventId = event._id;

    students.forEach(student => {
      if (student.group[groupId].attended.includes(eventId)) {
        attended.push(student);
      } else if (student.group[groupId].canceled.includes(eventId)) {
        canceled.push(student);
      } else {
        group.push(student);
      }
    });

    return { group, attended, canceled };
  };

  onClick = e => {
    const id = e.target.dataset.id;
    this.changeStudentStatus(id);
    this.forceUpdate();
  };

  changeStudentStatus = (id: string) => {
    let student = students.find(student => student._id === id);
    const groupId = event.group;
    const group = student.group[groupId];
    const eventId = event._id;

    if (group.attended.includes(eventId)) {
      group.attended = group.attended.filter(id => id != eventId);
      group.canceled.push(eventId);
      student.group[groupId] = group;
      students = students.map(stud => {
        if (stud._id === student._id) return student;
        else return stud;
      });
      return;
    }

    if (group.canceled.includes(eventId)) {
      group.canceled = group.canceled.filter(id => id != eventId);
      student.group[groupId] = group;
      students = students.map(stud => {
        if (stud._id === student._id) return student;
        else return stud;
      });
      return;
    }

    group.attended.push(eventId);
    student.group[groupId] = group;
    students = students.map(stud => {
      if (stud._id === student._id) return student;
      else return stud;
    });
  };

  render() {
    const { group, attended, canceled } = this.mapGroup(students, event);
    const time = formatTime(event.timeStart);
    const d = event.date;
    const day = `${d.getDay()}.${d.getMonth() + 1}.${d.getFullYear()}`;

    return (
      <Layout>
        <div className={cx("attendance")}>
          <div className={cx("attendance__title")}>
            Отметка посещаемости {event.name}
          </div>
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
              students={canceled}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default Attendance;
