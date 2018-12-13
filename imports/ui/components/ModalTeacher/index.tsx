import * as React from "react";
import * as InputMask from "react-input-mask/dist/react-input-mask.min";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { ITeacher } from "../../../models/teacher";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IState {
  teacher: ITeacher;
}

const name = "teacher";

class ModalTeacher extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      teacher: null
    };
  }

  onClose = () => {
    this.setState({
      teacher: null
    });
    this.props.closeModal(name);
  };

  getData = (_id: string) => {
    setTimeout(() => {
      this.setState({
        teacher: {
          _id: "1",
          firstName: "Александр",
          lastName: "Николаевич",
          phone: "+79458802023"
        }
      });
    }, 1000);
  };

  render() {
    const { form, modal } = this.props;
    const { teacher } = this.state;
    const { getFieldDecorator } = form;
    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    !teacher && modalKind && this.getData(modalKind);
    const isLoading = modalKind && !teacher;

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
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
        <div className={cx("from__item form__item_last-elem")}>
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
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalTeacher);

export default connect<IStateToProps, IDispatchFromProps>(
  (state: IStore) => ({
    modal: state.modal
  }),
  dispatch => ({
    closeModal: closeModal(dispatch)
  })
)(modal);
