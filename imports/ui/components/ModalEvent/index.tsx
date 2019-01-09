import * as React from "react";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IAuditory } from "../../../models/auditory";
import { IEvent } from "../../../models/event";
import { IGroup } from "../../..//models/group";
import ModalForm from "../ModalFrom";
import * as moment from "moment";
import { ReactiveVar } from "meteor/reactive-var";
import { eventsToDisabledTimes, getEventsQuery } from "../../../helpers/events";
import {
  formatMomentToDb,
  formatDbToMoment,
  formatDbToDate
} from "../../../helpers/time";

import { connect } from "react-redux";
import { closeModal } from "../../reducers/modalReducer";

import { Auditories } from "../../../api/auditories";
import { Events } from "../../../api/events";
import { Groups } from "../../../api/groups";

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
  event?: IEvent;
  group: IGroup;
  futureEvents?: IEvent[];
}

const name = "element-group";

let queryDate = new ReactiveVar(null);
let queryAuditoryId = new ReactiveVar(null);
let queryFutureEvents = new ReactiveVar(null);

class ModalEvent extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps
> {
  onClose = () => this.props.closeModal(name);

  onSubmit = (data: IEvent) => {
    const { event, futureEvents } = this.props;
    const id = event && event._id;
    const group = this.props.group;
    const timeStart = formatMomentToDb(data.timeStart);
    const timeEnd = formatMomentToDb(data.timeEnd);
    const date: Date = data.date.toDate();
    const isInfinite = !group.numberOfClasses;

    if (id) {
      Events.update(
        { _id: id },
        {
          name: group.name,
          auditoryId: data.auditoryId,
          teachersId: group.teacherId,
          groupId: group._id,
          date: date,
          timeStart,
          timeEnd,
          isInfinite,
          beginDate: formatDbToDate(timeStart, date),
          endDate: formatDbToDate(timeEnd, date)
        }
      );
      date.setDate(date.getDate() + 7);
      data.forFuture &&
        futureEvents.forEach((event, i) => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 7 * i);

          Events.update(
            { _id: event._id },
            {
              name: group.name,
              auditoryId: data.auditoryId,
              teachersId: group.teacherId,
              groupId: group._id,
              date: nextDay,
              timeStart,
              timeEnd,
              isInfinite,
              beginDate: formatDbToDate(timeStart, date),
              endDate: formatDbToDate(timeEnd, date)
            }
          );
        });
    } else {
      const numClasses = group.numberOfClasses || 10;
      for (let i = 0; i < numClasses; i++) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 7 * i);

        Events.insert({
          name: group.name,
          auditoryId: data.auditoryId,
          teachersId: group.teacherId,
          groupId: group._id,
          date: nextDay,
          timeStart,
          timeEnd,
          isInfinite,
          beginDate: formatDbToDate(timeStart, date),
          endDate: formatDbToDate(timeEnd, date)
        });
      }
    }
  };

  onDelete = () => {
    const { event, futureEvents } = this.props;
    const _id = event && event._id;

    Events.remove({ _id });
    futureEvents.forEach(event => Events.remove({ _id: event._id }));
  };

  getAuditoryItems = () =>
    this.props.auditories.map(auditory => (
      <Option key={auditory._id} value={auditory._id}>
        {auditory.name}
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

  onDateChange = newDate => queryDate.set(newDate.toDate());
  onAuditoryChange = newAuditory => queryAuditoryId.set(newAuditory);
  onChangeFutureEvents = e => queryFutureEvents.set(e.target.checked);

  render() {
    const { form, modal, event } = this.props;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    const isLoading = modalKind && !event;

    const auditoryItems = this.getAuditoryItems();

    const beginTime = event && formatDbToMoment(event.timeStart);
    const endTime = event && formatDbToMoment(event.timeEnd);

    const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 22, 23];

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        onDelete={this.onDelete}
        isLoading={isLoading}
        showDelete={!!event}
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
              rules: [{ required: true, message: "Выберете время" }]
            })(
              <TimePicker
                disabledHours={disabledHours}
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
              rules: [{ required: true, message: "Выберете время" }]
            })(
              <TimePicker
                disabledHours={disabledHours}
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

const modal = Form.create()(ModalEvent);

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
    const group: any = Groups.findOne({ _id: modal.groupId });
    const date = queryDate.get() || (event && event.date);
    const eventsQuery = getEventsQuery({
      date,
      auditoryId: queryAuditoryId.get(),
      teacherId: group && group.teacherId
    });
    const isFutureEvents = queryFutureEvents.get();
    const futureEvents =
      isFutureEvents &&
      Events.find({ date: { $gt: date } }, { sort: { date: 1 } }).fetch();

    return {
      event,
      auditories: Auditories.find().fetch(),
      events: Events.find(eventsQuery).fetch(),
      group,
      futureEvents
    };
  })
)(modal);
