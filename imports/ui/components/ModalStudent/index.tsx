import * as React from "react";
import * as InputMask from "react-input-mask/dist/react-input-mask.min";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IStudent } from "../../../models/student";
import { IGroup } from "../../../models/group";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";
import Button from "../Button";

import { Students } from "../../../api/students";
import { Groups } from "../../../api/groups";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const Select = require("antd/lib/select");
const Option = Select.Option;
const InputNumber = require("antd/lib/input-number");
const Icon = require("antd/lib/icon");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IProps {
  student: IStudent;
  groups: IGroup[];
}

interface IState {
  groupList: any[];
}

const name = "student";

class ModalStudent extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps,
  IState
> {
  constructor(props) {
    super(props);

    this.state = { groupList: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.modal[name] && this.props.modal[name]) {
      this.setState({ groupList: [] });
    }

    if (nextProps.student && !this.props.student) {
      const groupList = [];

      for (const groupId in nextProps.student.group) {
        groupList.push(groupId);
      }
      this.setState({ groupList });
    }
  }

  onClose = () => this.props.closeModal(name);

  onSubmit = (data: IStudent | any) => {
    const { student } = this.props;
    const id = student && student._id;

    if (id) {
      Students.update(
        { _id: id },
        {
          lastName: data.lastName,
          firstName: data.firstName,
          secondName: data.secondName,
          phone: data.phone,
          group: this.formGroupsToDB(data)
        }
      );
    } else {
      Students.insert({
        lastName: data.lastName,
        firstName: data.firstName,
        secondName: data.secondName,
        phone: data.phone,
        group: this.formGroupsToDB(data)
      });
    }
  };

  onDelete = () => Students.remove({ _id: this.props.student._id });

  formGroupsToDB = data => {
    const items = {};
    const { student } = this.props;
    const { groupList } = this.state;

    groupList.length &&
      groupList.forEach(groupNum => {
        const groupId = data[`groupId${groupNum}`];
        const studentData = student && student[groupNum];
        items[groupId] = {
          _id: groupId,
          numberLessons: +data[`numLesson${groupNum}`],
          attended: studentData ? studentData.attended : [],
          miss: studentData ? studentData.miss : [],
          canceled: studentData ? studentData.canceled : []
        };
      });

    return items;
  };

  addGroupField = () => {
    const groupListCopy: number[] = this.state.groupList.slice(0);
    groupListCopy.push(groupListCopy.length + 1);
    this.setState({ groupList: groupListCopy });
  };

  removeGroupField = i =>
    this.setState(prevState => ({
      groupList: prevState.groupList.filter(group => group != i)
    }));

  getGroupsFields = (groupList, options) =>
    groupList.map(groupId => this.getGroupFormFields(groupId, options));

  getGroupFormFields = (groupId, options) => {
    const { student, form } = this.props;
    const group = student && student.group[groupId];
    const { getFieldDecorator } = form;

    return (
      <div className={cx("form__group")} key={groupId}>
        <div className={cx("from__item")}>
          <FormItem label="Группа" hasFeedback>
            {getFieldDecorator(`groupId${groupId}`, {
              initialValue: group ? group._id : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберите группу" }]
            })(<Select>{options}</Select>)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Количество занятий" hasFeedback>
            {getFieldDecorator(`numLesson${groupId}`, {
              initialValue: group ? group.numberLessons : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите колличество занятий" }
              ]
            })(<InputNumber min={1} />)}
          </FormItem>
        </div>
        <Icon
          type="minus-circle-o"
          className={cx("form__remove")}
          onClick={() => this.removeGroupField(groupId)}
        />
      </div>
    );
  };

  getSelectOptions = items =>
    items.map(item => (
      <Option key={item._id} value={item._id}>
        {item.name}
      </Option>
    ));

  render() {
    const { form, modal, student, groups } = this.props;
    const { groupList } = this.state;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const isLoading = modalKind && !student;

    const groupItems = this.getSelectOptions(groups);
    const groupFields = this.getGroupsFields(groupList, groupItems);

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
        <div className={cx("from__item")}>
          <FormItem label="Фамилия" hasFeedback>
            {getFieldDecorator("lastName", {
              initialValue: student ? student.lastName : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите фамилию" },
                {
                  pattern: /[(A-Za-z)|(А-Яа-я)]+$/,
                  message: "Допустимы только буквы"
                }
              ]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Имя" hasFeedback>
            {getFieldDecorator("firstName", {
              initialValue: student ? student.firstName : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите имя" },
                {
                  pattern: /[(A-Za-z)|(А-Яа-я)]+$/,
                  message: "Допустимы только буквы"
                }
              ]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Отчество" hasFeedback>
            {getFieldDecorator("secondName", {
              initialValue: student ? student.secondName : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                {
                  pattern: /[(A-Za-z)|(А-Яа-я)]+$/,
                  message: "Допустимы только буквы"
                }
              ]
            })(<Input />)}
          </FormItem>
        </div>
        {groupFields}
        <div className={cx("form__button-add")}>
          <Button onClick={this.addGroupField}>
            <Icon type="plus" /> Добавить группу
          </Button>
        </div>
        <div className={cx("from__item form__item_last-elem")}>
          <FormItem label="Номер телефона" hasFeedback>
            {getFieldDecorator("phone", {
              initialValue: student ? student.phone : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите  номер телефона" },
                {
                  pattern: /\d{11}/,
                  message: "Введите номер телефона полностью"
                }
              ]
            })(<InputMask className="ant-input" mask="+79999999999" />)}
          </FormItem>
        </div>
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalStudent);

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
    const student = _id && Students.findOne({ _id });
    const groups = Groups.find().fetch();

    return {
      student,
      groups
    };
  })
)(modal);
