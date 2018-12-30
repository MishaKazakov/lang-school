import * as React from "react";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IActivity } from "../../../models/activity";
import { IAuditory } from "../../../models/auditory";
import { ITeacher } from "../../../models/teacher";
import { IAuditoryData } from "../../../models/auditoryData";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";
import * as moment from "moment";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const Select = require("antd/lib/select");
const Option = Select.Option;
const DatePicker = require("antd/lib/date-picker");
const TimePicker = require("antd/lib/time-picker").default;

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IState {
  activity: IActivity;
  auditoryData: IAuditoryData;
  auditories: IAuditory[];
  employees: ITeacher[];
}

const name = "activity";

class ModalActivity extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      activity: null,
      auditoryData: null,
      auditories: [
        { _id: "aud1", name: "Нью-Йорк", capacity: 10 },
        { _id: "aud2", name: "Лондон", capacity: 10 },
        { _id: "aud3", name: "Париж", capacity: 10 }
      ],
      employees: [
        { _id: "emp1", firstName: "qwe", lastName: "rty" },
        { _id: "emp2", firstName: "qwe", lastName: "rty" },
        { _id: "emp3", firstName: "qwe", lastName: "rty" }
      ]
    };
  }

  onClose = () => {
    this.setState({
      activity: null
    });
    this.props.closeModal(name);
  };

  getData = (_id: string) => {
    setTimeout(() => {
      this.setState({
        activity: {
          _id: "1",
          name: "123",
          date: new Date(Date.now()),
          group: "123",
          timeStart: [12, 0],
          timeEnd: [13, 0],
          employees: [{ _id: "emp1", firstName: "qwe", lastName: "rty" }],
          auditory: { _id: "aud1", name: "Нью-Йорк"}
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

  getEmployeeItems = () =>
    this.state.employees.map(employee => (
      <Option key={employee._id} value={employee._id}>
        {employee.firstName} {employee.lastName}
      </Option>
    ));

  render() {
    const { form, modal } = this.props;
    const { activity } = this.state;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    !activity && modalKind && this.getData(modalKind);
    const isLoading = modalKind && !activity;

    const timeFormat = "HH:mm";
    const datePlaceholder = "Введите дату";
    const timePlaceholder = "Введите время";
    const auditoryItems = this.getAuditoryItems();
    const employeeItems = this.getEmployeeItems();
    const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 22, 23];
    const beginTime = activity && this.getMomentTime(activity.timeStart);
    const endTime = activity && this.getMomentTime(activity.timeEnd);

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        isLoading={isLoading}
      >
        <div className={cx("form__item")}>
          <FormItem label="Название" hasFeedback>
            {getFieldDecorator("name", {
              initialValue: activity ? activity.name : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите название" }]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("form__item")}>
          <FormItem label="Дата" hasFeedback>
            {getFieldDecorator("date", {
              initialValue: activity ? moment(activity.date) : null,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: {datePlaceholder} }]
            })(<DatePicker placeholder={datePlaceholder} />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Время начала" hasFeedback>
            {getFieldDecorator("beginTime", {
              initialValue: beginTime,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: {timePlaceholder} }]
            })(
              <TimePicker
                disabledHours={disabledHours}
                disabledMinutes={this.getDisabledMinutes}
                hideDisabledOptions
                popupClassName={cx("time-picker__popup")}
                className={cx("time-picker")}
                format={timeFormat}
                placeholder={timePlaceholder}
              />
            )}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Время окончания" hasFeedback>
            {getFieldDecorator("endTime", {
              initialValue: endTime,
              validateTrigger: ["onChange"],
              rules: [{ required: true, message: {timePlaceholder} }]
            })(
              <TimePicker
                disabledHours={disabledHours}
                disabledMinutes={this.getDisabledMinutes}
                hideDisabledOptions
                popupClassName={cx("time-picker__popup")}
                className={cx("time-picker")}
                format={timeFormat}
                placeholder={timePlaceholder}
              />
            )}
          </FormItem>
        </div>
        <div className={cx("form__item")}>
          <FormItem label="Сотрудники" hasFeedback>
            {getFieldDecorator("employees", {
              initialValue: activity ? activity.employees.map(emp => emp._id) : [],
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберите сотрудников" }]
            })(
              <Select mode="multiple" tokenSeparators={[","]}>
                {employeeItems}
              </Select>
            )}
          </FormItem>
        </div>
        <div className={cx("form__item form__item_last-elem")}>
          <FormItem label="Аудитория" hasFeedback>
            {getFieldDecorator("auditory", {
              initialValue: activity ? activity.auditory._id : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберите аудиторию" }]
            })(<Select>{auditoryItems}</Select>)}
          </FormItem>
        </div>
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalActivity);

export default connect<IStateToProps, IDispatchFromProps>(
  (state: IStore) => ({
    modal: state.modal
  }),
  dispatch => ({
    closeModal: closeModal(dispatch)
  })
)(modal);
