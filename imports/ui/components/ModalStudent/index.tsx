import * as React from "react";
import * as InputMask from "react-input-mask/dist/react-input-mask.min";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IStudent } from "../../../models/student";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";
import Button from "../Button";

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

interface IState {
  student: IStudent;
}

const name = "student";

let numGroups = [];

class ModalStudent extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      student: null
    };
  }

  onClose = () => {
    this.setState({
      student: null
    });
    this.props.closeModal(name);
  };
  componentWillReceiveProps(nextProps) {
    if (!nextProps.modal[name] && this.props.modal[name]) {
      numGroups = [];
    }
  }

  getData = (_id: string) => {
    setTimeout(() => {
      this.setState({
        student: {
          _id: "1",
          firstName: "Дима",
          lastName: "Васнецов",
          phone: "+79138603035",
          group: {
            g1: {
              _id: "g1",
              name: "Английский",
              miss: [],
              attended: [],
              canceled: [],
              numberLessons: 5
            },
            g2: {
              _id: "g2",
              name: "Французкий",
              miss: [],
              attended: [],
              canceled: [],
              numberLessons: 5
            }
          }
        }
      });
    }, 1000);
  };

  getGroup = (student: IStudent, groupItemsOptions) => {
    const items = [];
    for (let groupId in student.group) {
      const group = student.group[groupId];
      items.push(this.getGroupItem({ group, groupItemsOptions }));
    }
    return items;
  };

  add = () => {
    numGroups.push(Math.floor(Math.random() * 100));
    this.forceUpdate();
  };

  remove = i => {
    numGroups = numGroups.filter(group => group != i);
    this.forceUpdate();
  };

  getGroupItem = args => {
    const { group = null, key = null, groupItemsOptions } = args;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx("form__group")} key={(group && group._id) || key}>
        <div className={cx("from__item")}>
          <FormItem label="Группа" hasFeedback>
            {getFieldDecorator(`group${key}_group`, {
              initialValue: group ? group._id : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Выберите группу" }]
            })(<Select>{groupItemsOptions}</Select>)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Количество занятий" hasFeedback>
            {getFieldDecorator(`group${key}_lessons`, {
              initialValue: group ? group.numberLessons : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите колличество занятий" }
              ]
            })(<InputNumber min={1} />)}
          </FormItem>
        </div>
        {key ? (
          <Icon
            type="minus-circle-o"
            className={cx("form__remove")}
            onClick={() => this.remove(key)}
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  render() {
    const { form, modal } = this.props;
    const { student } = this.state;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    !student && modalKind && this.getData(modalKind);
    const isLoading = modalKind && !student;

    const groupList = [
      {
        _id: "g1",
        name: "Английский"
      },
      {
        _id: "g2",
        name: "Французкий"
      }
    ];
    const groupItemsOptions = groupList.map(group => (
      <Option value={group._id}>{group.name}</Option>
    ));
    const completedFields =
      student && this.getGroup(student, groupItemsOptions);

    const emptyFields = numGroups.map(key =>
      this.getGroupItem({ key, groupItemsOptions })
    );

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        onSubmit={() => ""}
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
        {completedFields}
        {emptyFields}
        <div className={cx("form__button-add")}>
          <Button onClick={this.add}>
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

export default connect<IStateToProps, IDispatchFromProps>(
  (state: IStore) => ({
    modal: state.modal
  }),
  dispatch => ({
    closeModal: closeModal(dispatch)
  })
)(modal);
