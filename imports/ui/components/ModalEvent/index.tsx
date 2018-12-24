import * as React from "react";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IAuditory } from "../../../models/auditory";
import { IAuditoryData } from "../../../models/auditoryData";
import { IEvent } from "../../../models/event";
import ModalForm from "../ModalFrom";
import * as moment from "moment";

import { connect } from "react-redux";
import { closeModal } from "../../reducers/modalReducer";

import { FormComponentProps as FormProps } from "antd/lib/form";
const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Select = require("antd/lib/select");
const Option = Select.Option;
const TimePicker = require("antd/lib/time-picker").default;

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IState {
  event: IEvent;
  auditoryData: IAuditoryData;
  auditories: IAuditory[];
}

const name = "group-element";

class ModalEvent extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      auditoryData: null,
      auditories: [
        { _id: "aud1", name: "Нью-Йорк", capacity: 10 },
        { _id: "aud2", name: "Лондон", capacity: 10 },
        { _id: "aud3", name: "Париж", capacity: 10 }
      ]
    };
  }

  onClose = () => {
    this.setState({
      event: null
    });
    this.props.closeModal(name);
  };

  getData = (_id: string) => {
    setTimeout(() => {
      this.setState({
        event: {
          _id: "1",
          date: new Date(),
          day: 0,
          group: "1",
          name: "Николаевич",
          timeStart: [10, 0],
          timeEnd: [12, 0],
          auditory: { _id: "aud1" }
        },
        auditoryData: {
          _id: "data1",
          auditory_id: "1",
          date: new Date(),
          occupied: {
            13: [0, 45],
            16: [45, 59],
            17: [0, 30]
          }
        }
      });
    }, 1000);
  };

  dayNames = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье"
  ];

  getDayItems = () =>
    this.dayNames.map((day, i) => (
      <Option key={day} value={i}>
        {day}
      </Option>
    ));

  getAuditoryItems = () =>
    this.state.auditories.map(auditory => (
      <Option key={auditory._id} value={auditory._id}>
        {auditory.name}
      </Option>
    ));

  getMomentTime = time =>
    moment().set({
      hours: time[0],
      minutes: time[1]
    });

  getDisabledMinutes = (hour: number) => {
    let minutes = [];
    const interval = this.state.auditoryData.occupied[hour];

    if (interval) {
      for (let i = interval[0]; i < interval[1] + 1; i++) {
        minutes.push(i);
      }
    }

    return minutes;
  };

  render() {
    const { form, modal } = this.props;
    const { event } = this.state;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    const isLoading = modalKind && !event;
    isLoading && this.getData(modalKind);

    const auditoryItems = this.getAuditoryItems();
    const dayItems = this.getDayItems();

    const beginTime = event && this.getMomentTime(event.timeStart);
    const endTime = event && this.getMomentTime(event.timeEnd);

    const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 22, 23];

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        isLoading={isLoading}
      >
        <div className={cx("from__item")}>
          <FormItem label="День недели" hasFeedback>
            {getFieldDecorator("day", {
              initialValue: event ? event.day : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберете день недели" }]
            })(<Select>{dayItems}</Select>)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Аудитория" hasFeedback>
            {getFieldDecorator("auditory", {
              initialValue: event ? event.auditory._id : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберете аудитрию" }]
            })(<Select>{auditoryItems}</Select>)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Время начала" hasFeedback>
            {getFieldDecorator("begin-time", {
              initialValue: beginTime,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: "Введите  число" }]
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
        <div className={cx("from__item form__item_last-elem")}>
          <FormItem label="Время окончания" hasFeedback>
            {getFieldDecorator("end-time", {
              initialValue: endTime,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: "Введите  число" }]
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
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalEvent);

export default connect<IStateToProps, IDispatchFromProps>(
  (state: IStore) => ({
    modal: state.modal
  }),
  dispatch => ({
    closeModal: closeModal(dispatch)
  })
)(modal);
