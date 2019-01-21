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
import { eventsToDisabledTimes, getEventsQuery } from "../../../helpers/events";
import { formatDbToMoment } from "../../../helpers/time";

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

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Select = require("antd/lib/select");
const Option = Select.Option;
const TimePicker = require("antd/lib/time-picker").default;
const DatePicker = require("antd/lib/date-picker");
const Checkbox = require("antd/lib/checkbox");

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
}

const name = "element-activity";

let queryDate = new ReactiveVar(null);
let queryAuditoryId = new ReactiveVar(null);
let queryTeachersId = new ReactiveVar(null);
let queryFutureEvents = new ReactiveVar(null);

class ModalActivityEvent extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps
> {
  onClose = () => this.props.closeModal(name);

  onSubmit = (data: IEventForm) => {
    const { event, futureEvents, activity } = this.props;
    const id = event && event._id;
    const date: Date = data.date.toDate();
    const isInfinite = data.forFuture;

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
      createEvent({ data, group: activity, date, referenceable: true });

      for (let i = 1; i < numClasses; i++) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 7 * i);

        createEvent({ data, group: activity, date: nextDay });
      }
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

  checkTimeStatus = (rule, value, callback) => {
    const { timeStart, timeEnd }: any = this.props.form.getFieldsValue([
      "timeStart",
      "timeEnd"
    ]);

    if (timeStart && timeEnd && timeStart > timeEnd) {
      callback(true);
    } else {
      callback();
    }
  };

  onDateChange = newDate => queryDate.set(newDate.toDate());
  onAuditoryChange = newAuditory => queryAuditoryId.set(newAuditory);
  onChangeFutureEvents = e => queryFutureEvents.set(e.target.checked);
  onTeacherChange = teachers => queryTeachersId.set(teachers);

  render() {
    const { form, modal, event, auditories, teachers } = this.props;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const isLoading = modalKind && !event;

    const auditoryItems = this.getSelectItems(auditories);
    const teacherItems = this.getSelectItems(teachers);

    const beginTime = event && event && formatDbToMoment(event.timeStart);
    const endTime = event && event && formatDbToMoment(event.timeEnd);

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
        <div className={cx("from__item form__date")}>
          <FormItem label="Дата" hasFeedback>
            {getFieldDecorator("date", {
              initialValue: event ? moment(event.date) : null,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: "Выберете дату" }]
            })(<DatePicker onChange={this.onDateChange} />)}
          </FormItem>
        </div>
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
        <div className={cx("from__item")}>
          <FormItem label="Аудитория" hasFeedback>
            {getFieldDecorator("auditoryId", {
              initialValue: event ? event.auditoryId : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберите аудитрию" }]
            })(
              <Select onChange={this.onAuditoryChange}>{auditoryItems}</Select>
            )}
          </FormItem>
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
                  validator: this.checkTimeStatus,
                  message: "Время окончания не может быть раньше начала"
                }
              ]
            })(
              <TimePicker
                disabledMinutes={this.getDisabledMinutes}
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
            <FormItem label="Для всего последующего расписания" hasFeedback>
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
    const eventsQuery = getEventsQuery({
      date,
      auditoryId: queryAuditoryId.get(),
      teacherId
    });
    const isFutureEvents = queryFutureEvents.get();
    const futureEvents =
      isFutureEvents &&
      Events.find({ date: { $gt: date } }, { sort: { date: 1 } }).fetch();

    return {
      event,
      auditories: Auditories.find().fetch(),
      teachers: Teachers.find().fetch(),
      events: Events.find(eventsQuery).fetch(),
      activity,
      futureEvents
    };
  })
)(modal);
