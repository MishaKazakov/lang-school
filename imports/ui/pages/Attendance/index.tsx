import * as React from "react";
import Layout from "../../components/Layout";
import StudentGroup from "../../components/StudentGroup";
import { IStudent, IStatus, IStudentGroup } from "../../../models/student";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";
import { isIncludes } from "../../../helpers/events";
import * as qs from "query-string";

import { Location, History } from "history";
import { withRouter } from "react-router";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

import { Events } from "../../../api/events";
import { Students } from "../../../api/students";

const Loader = require("antd/lib/spin");
const Icon = require("antd/lib/icon");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  students: IStudent[];
  event: IEvent;
  location: Location;
  history: History;
}

class Attendance extends React.Component<IProps> {
  mapGroup = (students: IStudent[], event) => {
    const missed = [];
    const attended = [];
    const canceled = [];

    if (!event || !students) {
      return { missed, attended, canceled };
    }

    const groupId: string = event.groupId;
    const eventId = event._id;

    students.forEach(student => {
      const studentGroup: IStudentGroup = student.group[groupId];
      if (!studentGroup) {
        return;
      }
      if (isIncludes(studentGroup.miss, eventId)) {
        missed.push(student);
      } else if (isIncludes(studentGroup.canceled, eventId)) {
        canceled.push(student);
      } else {
        attended.push(student);
      }
    });

    missed.sort(this.sortStudent);
    attended.sort(this.sortStudent);
    canceled.sort(this.sortStudent);

    return { missed, attended, canceled };
  };

  sortStudent = (a: IStudent, b: IStudent) => {
    if (a.firstName > b.firstName) return 1;
    if (a.firstName < b.firstName) return -1;
  };

  onRightCLick = (id: string) => {
    const { event, students } = this.props;
    let student = students.find(student => student._id === id);
    const groupId = event.groupId;
    const group = student.group[groupId];
    const eventId = event._id;
    const eventStat = { id: eventId, date: event.date };

    if (isIncludes(group.miss, eventId)) {
      group.miss = group.miss.filter((status: IStatus) => status.id != eventId);
      group.attended.push(eventStat);

      this.updateStudent(student, groupId, group);
      this.forceUpdate();
      return;
    }

    if (isIncludes(group.canceled, eventId)) {
      group.canceled = group.canceled.filter(
        (status: IStatus) => status.id != eventId
      );
      group.miss.push(eventStat);

      this.updateStudent(student, groupId, group);
      this.forceUpdate();
      return;
    }

    group.attended = group.attended.filter(
      (status: IStatus) => status.id != eventId
    );
    group.canceled.push(eventStat);

    this.updateStudent(student, groupId, group);
    this.forceUpdate();
  };

  onLeftClick = (id: string) => {
    const { event, students } = this.props;
    let student = students.find(student => student._id === id);
    const groupId = event.groupId;
    const group = student.group[groupId];
    const eventId = event._id;
    const eventStat = { id: eventId, date: event.date };

    if (isIncludes(group.miss, eventId)) {
      group.miss = group.miss.filter((status: IStatus) => status.id != eventId);
      group.canceled.push(eventStat);

      this.updateStudent(student, groupId, group);
      this.forceUpdate();
      return;
    }

    if (isIncludes(group.canceled, eventId)) {
      group.canceled = group.miss.filter(
        (status: IStatus) => status.id != eventId
      );
      group.attended.push(eventStat);

      this.updateStudent(student, groupId, group);
      this.forceUpdate();
      return;
    }

    group.attended = group.miss.filter(
      (status: IStatus) => status.id != eventId
    );
    group.miss.push(eventStat);

    this.updateStudent(student, groupId, group);
    this.forceUpdate();
  };

  updateStudent = (student: IStudent, groupId, group) => {
    student.group[groupId] = group;
    Students.update({ _id: student._id }, { ...student });
  };

  render() {
    const { students, event, history } = this.props;
    const { missed, attended, canceled } = this.mapGroup(students, event);
    const time = event && formatTime(event.timeStart);
    const day = event && event.date;
    const dayTittle =
      event && `${day.getDate()}.${day.getMonth() + 1}.${day.getFullYear()}`;
    const eventName = event ? event.name : "";

    return (
      <Layout>
        {event && students ? (
          <>
            <a className={cx("attendance__go-back")} onClick={history.goBack}>
              <Icon type="arrow-left" />
              <span> Вернутся назад</span>
            </a>
            <div className={cx("attendance")}>
              <div className={cx("attendance__title")}>
                Отметка посещаемости {eventName}
              </div>
              <div className={cx("attendance__day")}>Дата: {dayTittle}</div>
              <div className={cx("attendance__day")}>Время: {time}</div>
              <div className={cx("attendance__groups")}>
                <StudentGroup
                  onLeftClick={this.onLeftClick}
                  onRightClick={this.onRightCLick}
                  title="Не пришли"
                  students={missed}
                />
                <StudentGroup
                  onLeftClick={this.onLeftClick}
                  onRightClick={this.onRightCLick}
                  title="Пришли"
                  students={attended}
                />
                <StudentGroup
                  onLeftClick={this.onLeftClick}
                  onRightClick={this.onRightCLick}
                  title="Отменили"
                  students={canceled}
                />
              </div>
            </div>
          </>
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
