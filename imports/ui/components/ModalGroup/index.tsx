import * as React from "react";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { ITeacher } from "../../../models/teacher";
import { IGroup } from "../../../models/group";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";
import * as moment from "moment";

import { Groups } from "../../../api/groups";
import { Teachers } from "../../../api/teachers";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

const ruLocale = require("antd/lib/date-picker/locale/ru_RU");
const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const InputNumber = require("antd/lib/input-number");
const DatePicker = require("antd/lib/date-picker");
const Select = require("antd/lib/select");
const Option = Select.Option;

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IDataProps {
  group: any;
  teachers: any;
}

interface IProps {
  group: IGroup;
  teachers: ITeacher[];
}

const name = "group";

class ModalGroup extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps
> {
  onClose = () => this.props.closeModal(name);

  onSubmit = (data: IGroup) => {
    const { group } = this.props;
    const id = group && group._id;

    if (id) {
      Groups.update(
        { _id: id },
        {
          name: data.name,
          teacherId: data.teacherId,
          startDate: data.startDate.toDate(),
          numberOfClasses: data.numberOfClasses
        }
      );
    } else {
      Groups.insert({
        name: data.name,
        teacherId: data.teacherId,
        startDate: data.startDate.toDate(),
        numberOfClasses: data.numberOfClasses
      });
    }
  };

  getTeacherItems = (teachers: ITeacher[]) =>
    teachers.map(teacher => (
      <Option key={teacher._id} value={teacher._id}>{`${teacher.lastName} ${
        teacher.firstName
      }`}</Option>
    ));

  render() {
    const { form, modal, group, teachers } = this.props;
    const { getFieldDecorator } = form;
    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    const isLoading = modalKind && !group;
    const teacherItems = this.getTeacherItems(teachers);

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        isLoading={isLoading}
      >
        <div className={cx("from__item")}>
          <FormItem label="Название" hasFeedback>
            {getFieldDecorator("name", {
              initialValue: group ? group.name : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите название" }]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Преподаватель" hasFeedback>
            {getFieldDecorator("teacherId", {
              initialValue: group ? group.teacherId : null,
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите преподавателя" }]
            })(<Select>{teacherItems}</Select>)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Дата начала" hasFeedback>
            {getFieldDecorator("startDate", {
              initialValue: group ? moment(group.startDate) : moment()
            })(<DatePicker locale={ruLocale} />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Число занятий" hasFeedback>
            {getFieldDecorator("nubberOfClasses", {
              initialValue: group ? group.numberOfClasses : ""
            })(<InputNumber min={1} />)}
          </FormItem>
        </div>
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalGroup);

export default compose(
  connect<IStateToProps, IDispatchFromProps>(
    (state: IStore) => ({
      modal: state.modal
    }),
    dispatch => ({
      closeModal: closeModal(dispatch)
    })
  ),
  withTracker<IDataProps, IProps & IStateToProps>(({ modal }) => {
    const _id = modal.extra;
    const teachers = Teachers.find().fetch();

    if (_id) {
      return {
        group: Groups.findOne({ _id }),
        teachers
      };
    }

    return {
      group: null,
      teachers
    };
  })
)(modal);