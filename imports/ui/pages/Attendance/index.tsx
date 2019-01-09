import * as React from "react";
import Layout from "../../components/Layout";
import StudentGroup from "../../components/StudentGroup";
import { IStudent } from "../../../models/student";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";
import * as qs from "query-string";

import { Location } from "history";
import { withRouter } from "react-router";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

import { Events } from "../../../api/events";
import { Students } from "../../../api/students";

const Loader = require("antd/lib/spin");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  students: IStudent[];
  event: IEvent;
  location: Location;
}

class Attendance extends React.Component<IProps> {
  mapGroup = (students: IStudent[], event) => {
    const group = [];
    const attended = [];
    const canceled = [];

    if (!event || !students) {
      return { group, attended, canceled };
    }

    const groupId: string = event.groupId;
    const eventId = event._id;

    students.forEach(student => {
      const studentGroup = student.group[groupId];
      if (!studentGroup) {
        return;
      }
      if (studentGroup.attended.includes(eventId)) {
        attended.push(student);
      } else if (studentGroup.canceled.includes(eventId)) {
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
    const { event, students } = this.props;
    let student = students.find(student => student._id === id);
    const groupId = event.groupId;
    const group = student.group[groupId];
    const eventId = event._id;

    if (group.attended.includes(eventId)) {
      group.attended = group.attended.filter(id => id != eventId);
      group.canceled.push(eventId);
      this.updateStudent(student, groupId, group);
      return;
    }

    if (group.canceled.includes(eventId)) {
      group.canceled = group.canceled.filter(id => id != eventId);
      this.updateStudent(student, groupId, group);
      return;
    }

    group.attended.push(eventId);
    this.updateStudent(student, groupId, group);
  };

  updateStudent = (student: IStudent, groupId, group) => {
    student.group[groupId] = group;
    Students.update({ _id: student._id }, { ...student });
  };

  render() {
    const { students, event } = this.props;
    const { group, attended, canceled } = this.mapGroup(students, event);
    const time = event && formatTime(event.timeStart);
    const day = event && event.date;
    const dayTittle =
      event && `${day.getDay()}.${day.getMonth() + 1}.${day.getFullYear()}`;
    const eventName = event ? event.name : "";

    return (
      <Layout>
        {event && students ? (
          <div className={cx("attendance")}>
            <div className={cx("attendance__title")}>
              Отметка посещаемости {eventName}
            </div>
            <div className={cx("attendance__day")}>Дата: {dayTittle}</div>
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
        ) : (
          <div className={cx("attendance__loader")}>
            <Loader />
          </div>
        )}
      </Layout>
    );
  }
}

export default compose(
  withRouter,
  withTracker<any, IProps>(({ location }) => {
    const _id = location && qs.parse(location.search)["id"];
    const event: any = Events.findOne({ _id });
    const groupId = event && event.groupId;
    const students =
      event &&
      Students.find({ [`group.${groupId}`]: { $exists: true } }).fetch();

    return {
      event,
      students
    };
  })
)(Attendance);
