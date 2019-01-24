import * as React from "react";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IAuditory } from "../../../models/auditory";
import { IEvent, IEventForm } from "../../../models/event";
import { ITeacher } from "../../../models/teacher";
import { IActivity } from "../../../models/activity";
import ModalForm from "../ModalFrom";
import * as moment from "moment";
import { ReactiveVar } from "meteor/reactive-var";
import {
  eventsToDisabledTimes,
  getEventsQuery,
  getNearestEvent
} from "../../../helpers/events";
import {
  formatDbToMoment,
  setToMidnight,
  getEndTime
} from "../../../helpers/time";

import { connect } from "react-redux";
import { closeModal } from "../../reducers/modalReducer";

import { Auditories } from "../../../api/auditories";
import { Activities } from "../../../api/activities";
import { Teachers } from "../../../api/teachers";
import {
  Events,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteFutureEvents
} from "../../../api/events";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

import { FormComponentProps as FormProps } from "antd/lib/form";

import Button from "../Button";
const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Select = require("antd/lib/select");
const Option = Select.Option;
const TimePicker = require("antd/lib/time-picker").default;
const DatePicker = require("antd/lib/date-picker");
const Checkbox = require("antd/lib/checkbox");
const Icon = require("antd/lib/icon");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IProps {
  auditories?: IAuditory[];
  events?: IEvent[];
  teachers: ITeacher[];
  event?: IEvent;
  activity: IActivity;
  futureEvents?: IEvent[];
  nearestEvent: IEvent;
}

const name = "element-activity";

let queryDate = new ReactiveVar([]);
let queryAuditoryId = new ReactiveVar(null);
let queryTeachersId = new ReactiveVar(null);
let queryFutureEvents = new ReactiveVar(null);
let queryStartTime = new ReactiveVar(null);

interface IState {
  dateList: number[];
}

class ModalActivityEvent extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps,
  IState
> {
  constructor(props) {
    super(props);

    this.state = { dateList: [] };
  }

  onClose = () => {
    this.props.closeModal(name);
    this.closePreparations();
  };

  closePreparations = () => {
    this.setState({ dateList: [] });
    queryDate.set([]);
    queryAuditoryId.set(null);
    queryTeachersId.set(null);
    queryFutureEvents.set(null);
  };

  onSubmit = (data: IEventForm) => {
    const { event, futureEvents, activity } = this.props;
    const { dateList } = this.state;
    const id = event && event._id;
    const isInfinite = data.forFuture;
    const date: Date = setToMidnight(data.date);

    if (id) {
      updateEvent({
        data,
        group: activity,
        date,
        event,
        referenceable: isInfinite
      });

      date.setDate(date.getDate() + 7);
      isInfinite &&
        futureEvents.forEach((event, i) => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 7 * i);

          updateEvent({ data, group: activity, date: nextDay, event });
        });
    } else {
      let numClasses = 1;
      if (activity.numberOfClasses) {
        numClasses = activity.numberOfClasses;
      }
      if (isInfinite) {
        numClasses = 10;
      }

      this.createEvents(activity, numClasses, data, date);
      dateList.forEach(dateNum => {
        const newDate = setToMidnight(data[`date${dateNum}`]);
        this.createEvents(activity, numClasses, data, newDate);
      });
    }
  };

  createEvents = (activity, numClasses, data, date) => {
    createEvent({ data, group: activity, date, referenceable: true });

    for (let i = 1; i < numClasses; i++) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 7 * i);

      createEvent({ data, group: activity, date: nextDay });
    }
  };

  onDelete = () => {
    const { event } = this.props;

    deleteEvent(event);
    deleteFutureEvents(event);
  };

  getSelectItems = items =>
    items.map(item => (
      <Option key={item._id} value={item._id}>
        {item.name ? item.name : `${item.lastName} ${item.firstName}`}
      </Option>
    ));

  getDisabledMinutes = (hour: number) => {
    let minutes = [];
    const intervals = eventsToDisabledTimes(this.props.events)[hour];

    if (intervals) {
      intervals.forEach(interval => {
        for (let i = interval[0]; i < interval[1]; i++) {
          minutes.push(i);
        }
      });
    }

    return minutes;
  };

  startTimeSet = (startTime: moment.Moment) => {};

  getDisabledTime = (hour: number): number[] => {
    const { form, nearestEvent } = this.props;
    const { timeStart }: any = form.getFieldsValue(["timeStart"]);
    let minutes = this.getDisabledMinutes(hour);

    if (!timeStart) return minutes;

    if (hour < timeStart.hour()) {
      const minutesBefore = Array.from({ length: 60 }, (v, i) => i);
      return minutes.concat(minutesBefore);
    }
    if (hour === timeStart.hour()) {
      const minutesBefore = Array.from(
        { length: timeStart.minutes() + 1 },
        (v, i) => i
      );
      return minutes.concat(minutesBefore);
    }

    if (!nearestEvent) return;

    const eventStartTime = nearestEvent.beginDate;

    if (hour === eventStartTime.getHours()) {
      for (let i = eventStartTime.getMinutes(); i < 60; i++) {
        minutes.push(i);
      }
      return minutes;
    }

    if (hour > eventStartTime.getHours()) {
      const lastMinutes = Array.from({ length: 60 }, (v, i) => i);
      return minutes.concat(lastMinutes);
    }
  };

  checkTimeStatus = (rule, value, callback) => {
    const { timeStart, timeEnd }: any = this.props.form.getFieldsValue([
      "timeStart",
      "timeEnd"
    ]);

    if (timeStart && timeEnd && timeStart > timeEnd) {
      callback(true); // error state
    }
    callback();
  };

  checkEndTime = (rule, value, callback) => {
    const { form, nearestEvent } = this.props;
    const { timeEnd }: any = form.getFieldsValue(["timeEnd"]);

    if (!nearestEvent) callback();

    const eventStartTime = nearestEvent.beginDate;

    if (timeEnd.hour() > eventStartTime.getHours()) callback(true);

    if (
      timeEnd.hour() === eventStartTime.getHours() &&
      timeEnd.minutes() >= eventStartTime.getMinutes()
    )
      callback(true);

    callback();
  };

  addDateField = () => {
    const dateListCopy: number[] = this.state.dateList.slice(0);
    dateListCopy.push(dateListCopy.length + 1);
    this.setState({ dateList: dateListCopy });
  };

  removeDateField = i =>
    this.setState(prevState => ({
      dateList: prevState.dateList.filter(date => date != i)
    }));

  getDatesFields = dateList =>
    dateList.map(dateNum => this.getDateFormFields(dateNum));

  getDateFormFields = dateNum => {
    const { getFieldDecorator } = this.props.form;

    return (
      <div
        className={cx("from__item form__date form__no-margin")}
        key={dateNum}
      >
        <FormItem label="Дата" hasFeedback>
          {getFieldDecorator(`date${dateNum}`, {
            validateTrigger: ["onChange"],
            rules: [{ required: true, message: "Выберете дату" }]
          })(<DatePicker onChange={this.onDateChange} />)}
        </FormItem>
        <Icon
          type="minus-circle-o"
          className={cx("form__delete-item", "form__icon")}
          onClick={() => this.removeDateField(dateNum)}
        />
      </div>
    );
  };

  onDateChange = newDate => {
    const prevDate = queryDate.get();
    prevDate.push(newDate.toDate());
    queryDate.set(prevDate);
  };
  onAuditoryChange = newAuditory => queryAuditoryId.set(newAuditory);
  onChangeFutureEvents = e => queryFutureEvents.set(e.target.checked);
  onTeacherChange = teachers => queryTeachersId.set(teachers);
  onStartTimeChange = (time: moment.Moment) =>
    queryStartTime.set(time.toDate());

  getAuditoryComment = (auditoryId: string) =>
    this.props.auditories.find(
      (auditory: IAuditory) => auditory._id === auditoryId
    ).comment;

  render() {
    const { form, modal, event, auditories, teachers } = this.props;
    const { dateList } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    const modalKind = modal.extra;
    const isLoading = modalKind && !event;

    const auditoryItems = this.getSelectItems(auditories);
    const teacherItems = this.getSelectItems(teachers);

    const auditoryID = queryAuditoryId.get();
    const auditoryComment = auditoryID && this.getAuditoryComment(auditoryID);

    const startTime = getFieldValue("timeStart");
    const beginTime = event && event && formatDbToMoment(event.timeStart);
    const endTime = event
      ? formatDbToMoment(event.timeEnd)
      : (startTime && getEndTime(startTime)) || null;

    const dateFields = this.getDatesFields(dateList);

    return (
      <ModalForm
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        onDelete={this.onDelete}
        isEdit={modalKind}
        isLoading={isLoading}
      >
        <div
          className={cx("from__item form__date", {
            "form__no-margin": !modalKind
          })}
        >
          <FormItem label="Дата" hasFeedback>
            {getFieldDecorator("date", {
              initialValue: event ? moment(event.date) : null,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: "Выберете дату" }]
            })(<DatePicker onChange={this.onDateChange} />)}
          </FormItem>
        </div>
        {dateFields || ""}
        {!modalKind && (
          <div className={cx("form__button-add")}>
            <Button onClick={this.addDateField}>
              <Icon type="plus" /> Добавить дату
            </Button>
          </div>
        )}
        <div className={cx("from__item")}>
          <FormItem label="Преподаватели" hasFeedback>
            {getFieldDecorator("teachersId", {
              initialValue: event ? event.teachersId : undefined
            })(
              <Select mode="multiple" onChange={this.onTeacherChange}>
                {teacherItems}
              </Select>
            )}
          </FormItem>
        </div>
        <div
          className={cx("from__item", { "form__no-margin": !!auditoryComment })}
        >
          <FormItem label="Аудитория" hasFeedback>
            {getFieldDecorator("auditoryId", {
              initialValue: event ? event.auditoryId : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберите аудитрию" }]
            })(
              <Select onChange={this.onAuditoryChange}>{auditoryItems}</Select>
            )}
          </FormItem>
          {auditoryComment && (
            <div className={cx("form__comment")}>{auditoryComment}</div>
          )}
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Время начала" hasFeedback>
            {getFieldDecorator("timeStart", {
              initialValue: beginTime,
              validateTrigger: ["onChange"],
              rules: [
                { required: true, message: "Выберете время" },
                {
                  validator: this.checkTimeStatus,
                  message: "Время окончания не может быть раньше начала"
                }
              ]
            })(
              <TimePicker
                disabledMinutes={this.getDisabledMinutes}
                hideDisabledOptions
                onChange={this.onStartTimeChange}
                popupClassName={cx("time-picker__popup")}
                className={cx("time-picker")}
                format="HH:mm"
              />
            )}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Время окончания" hasFeedback>
            {getFieldDecorator("timeEnd", {
              initialValue: endTime,
              validateTrigger: ["onChange"],
              rules: [
                { required: true, message: "Выберете время" },
                {
                  validator: this.checkEndTime,
                  message: "Это время уже занятно. Поставьте пораньше"
                }
              ]
            })(
              <TimePicker
                disabledMinutes={this.getDisabledTime}
                hideDisabledOptions
                popupClassName={cx("time-picker__popup")}
                className={cx("time-picker")}
                format="HH:mm"
              />
            )}
          </FormItem>
        </div>
        {modalKind && (
          <div
            className={cx(
              "from__item form__item_last-elem form__item__checkbox"
            )}
          >
            <FormItem label="Изменить последующие мероприятия" hasFeedback>
              {getFieldDecorator("forFuture")(
                <Checkbox onChange={this.onChangeFutureEvents} />
              )}
            </FormItem>
          </div>
        )}
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalActivityEvent);

export default compose(
  connect<IStateToProps, IDispatchFromProps>(
    (state: IStore) => ({
      modal: state.modal
    }),
    dispatch => ({
      closeModal: closeModal(dispatch)
    })
  ),
  withTracker<any, IProps & IStateToProps>(({ modal }) => {
    const _id = modal.extra;
    const event: any = _id && Events.findOne({ _id });
    const activity: any = Activities.findOne({ _id: modal.groupId });
    const date = queryDate.get() || (event && event.date);
    const teacherId = queryTeachersId.get() || (event && event.teachersId);
    const numClasses = activity && (activity.numberOfClasses || 10);

    const events = Events.find(
      getEventsQuery({
        date,
        auditoryId: queryAuditoryId.get(),
        teacherId,
        numClasses
      })
    ).fetch();

    const isFutureEvents = queryFutureEvents.get();
    const futureEvents =
      isFutureEvents &&
      Events.find({ date: { $gt: date } }, { sort: { date: 1 } }).fetch();

    const auditories = Auditories.find().fetch();

    let nearestEvent;
    const eventStartTime = queryStartTime.get();

    let startTime;
    if (eventStartTime) {
      startTime = eventStartTime;
    } else if (event) {
      startTime = event.beginDate;
    }

    if (startTime && events) {
      nearestEvent = getNearestEvent(startTime, events);
    }

    return {
      event,
      auditories,
      teachers: Teachers.find().fetch(),
      events,
      activity,
      futureEvents,
      nearestEvent
    };
  })
)(modal);
