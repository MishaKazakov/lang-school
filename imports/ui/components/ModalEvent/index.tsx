import * as React from "react";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IAuditory } from "../../../models/auditory";
import { IEvent, IEventForm } from "../../../models/event";
import { IGroup } from "../../..//models/group";
import ModalForm from "../ModalFrom";
import * as moment from "moment";
import { ReactiveVar } from "meteor/reactive-var";
import { eventsToDisabledTimes, getEventsQuery } from "../../../helpers/events";
import { formatDbToMoment, setToMidnight } from "../../../helpers/time";

import { connect } from "react-redux";
import { closeModal } from "../../reducers/modalReducer";

import { Auditories } from "../../../api/auditories";
import { Groups } from "../../../api/groups";
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
  event?: IEvent;
  group: IGroup;
  futureEvents?: IEvent[];
}

const name = "element-group";

let queryDate = new ReactiveVar([]);
let queryAuditoryId = new ReactiveVar(null);
let queryFutureEvents = new ReactiveVar(null);

interface IState {
  dateList: number[];
}

class ModalEvent extends React.Component<
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
    queryFutureEvents.set(null);
  };

  onSubmit = (data: IEventForm) => {
    const { event, futureEvents, group } = this.props;
    const { dateList } = this.state;
    const id = event && event._id;
    const date: Date = setToMidnight(data.date);

    if (id) {
      updateEvent({ data, group, date, event, referenceable: data.forFuture });

      date.setDate(date.getDate() + 7);
      futureEvents &&
        futureEvents.forEach((event, i) => {
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 7 * i);
          updateEvent({ data, group, date: nextDate, event });
        });
    } else {
      this.createEvents(data, group, date);
      dateList.forEach(dateNum => {
        const newDate = setToMidnight(data[`date${dateNum}`]);
        this.createEvents(data, group, newDate);
      });
    }
  };

  createEvents = (data, group, date) => {
    const numClasses = group.numberOfClasses || 10;
    createEvent({ data, group, date, referenceable: true });

    for (let i = 1; i < numClasses; i++) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 7 * i);
      createEvent({ data, group, date: nextDate });
    }
  };

  onDelete = () => {
    const { event } = this.props;

    deleteEvent(event);
    deleteFutureEvents(event);
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

  getAuditoryComment = (auditoryId: string) =>
    this.props.auditories.find(
      (auditory: IAuditory) => auditory._id === auditoryId
    ).comment;

  render() {
    const { form, modal, event } = this.props;
    const { dateList } = this.state;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const isLoading = modalKind && !event;

    const auditoryItems = this.getAuditoryItems();

    const auditoryID = queryAuditoryId.get();
    const auditoryComment = auditoryID && this.getAuditoryComment(auditoryID);

    const beginTime = event && formatDbToMoment(event.timeStart);
    const endTime = event && formatDbToMoment(event.timeEnd);

    const dateFields = this.getDatesFields(dateList);
    
    return (
      <ModalForm
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        onDelete={this.onDelete}
        isLoading={isLoading}
        isEdit={modalKind}
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
              rules: [{ required: true, message: "Выберете время" }]
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
        <div
          className={cx("from__item", { "form__item_last-elem": !modalKind })}
        >
          <FormItem label="Время окончания" hasFeedback>
            {getFieldDecorator("timeEnd", {
              initialValue: endTime,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: "Выберете время" }]
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

    const isFutureEvents = queryFutureEvents.get();
    const futureEvents =
      isFutureEvents &&
      Events.find({ date: { $gt: date } }, { sort: { date: 1 } }).fetch();
    const events = Events.find(
      getEventsQuery({
        _id,
        date,
        auditoryId: queryAuditoryId.get(),
        teacherId: group && group.teacherId
      })
    ).fetch();

    return {
      event,
      auditories: Auditories.find().fetch(),
      events,
      group,
      futureEvents
    };
  })
)(modal);
