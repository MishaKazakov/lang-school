import * as React from "react";
import * as InputMask from "react-input-mask/dist/react-input-mask.min";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { ITeacher, ITeacherForm } from "../../../models/teacher";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";

import { Teachers } from "../../../api/teachers";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const message = require("antd/lib/message");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IDataProps {
  teacher: any;
}

interface IProps {
  teacher: ITeacher;
}

const name = "teacher";

class ModalTeacher extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps
> {
  constructor(props) {
    super(props);

    this.state = { email: "" };
  }

  onClose = () => {
    this.setState({
      teacher: null,
      email: null
    });
    this.props.closeModal(name);
  };

  componentDidMount() {
    const teacher = this.props.teacher;
    teacher &&
      teacher.userId &&
      Meteor.call("getUserEmail", teacher.userId, (error, result) => {
        if (!error) this.setState({ email: result });
      });
  }

  onSubmit = (data: ITeacherForm) => {
    const { teacher } = this.props;
    const id = teacher && teacher._id;

    if (id) {
      Meteor.call("updateTeacher", id, data, (error, data: string) => {
        if (error) {
          console.log(error);
          message.error(
            "Ошибка, пользователь с таким email адресом уже существует"
          );
        }
      });
    } else {
      Meteor.call("createTeacher", data, (error, data) => {
        if (error) {
          console.log(error);
          message.error(
            "Ошибка, пользователь с таким email адресом уже существует"
          );
        } else {
          message.success(
            "Пользователь успешно создан, стандартный пароль : " + data,
            5
          );
        }
      });
    }
  };

  onDelete = () =>
    Meteor.call("removeTeacher", this.props.teacher._id, (error, data) => {
      if (error) {
        console.log(error);
        message.error("Ошибка, невозможно удалить пользователя");
      } else {
        message.success("Пользователь успешно удален", 5);
      }
    });

  render() {
    const { form, modal, teacher } = this.props;
    const { getFieldDecorator } = form;
    const modalKind = modal.extra;
    const isLoading = modalKind && !teacher;
    const email = (this.state as { email: string }).email;

    teacher &&
      teacher.userId &&
      !email &&
      Meteor.call("getUserEmail", teacher.userId, (error, result) => {
        if (!error) this.setState({ email: result });
      });

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
              initialValue: teacher ? teacher.lastName : "",
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
              initialValue: teacher ? teacher.firstName : "",
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
              initialValue: teacher ? teacher.secondName : "",
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
        <div className={cx("from__item")}>
          <FormItem label="Номер телефона" hasFeedback>
            {getFieldDecorator("phone", {
              initialValue: teacher ? teacher.phone : "",
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
        <div className={cx("from__item form__item_last-elem")}>
          <FormItem label="email" hasFeedback>
            {getFieldDecorator("email", {
              initialValue: email,
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите  email" },
                {
                  type: "email",
                  message: "Введите email полностью"
                }
              ]
            })(<Input type="email" />)}
          </FormItem>
        </div>
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalTeacher);

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
    const teacher = _id && Teachers.findOne({ _id });
    
    return {
      teacher
    };
  })
)(modal);
