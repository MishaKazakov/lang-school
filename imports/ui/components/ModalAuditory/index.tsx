import * as React from "react";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IAuditory } from "../../../models/auditory";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const InputNumber = require("antd/lib/input-number");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IState {
  auditory: IAuditory;
}

const name = "auditory";

class ModalAuditory extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      auditory: null
    };
  }

  onClose = () => {
    this.setState({
      auditory: null
    });
    this.props.closeModal(name);
  };

  getData = (_id: string) => {
    setTimeout(() => {
      this.setState({
        auditory: {
          _id: "1",
          name: "Николаевич",
          capacity: 10
        }
      });
    }, 1000);
  };

  render() {
    const { form, modal } = this.props;
    const { auditory } = this.state;
    const { getFieldDecorator } = form;
    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    !auditory && modalKind && this.getData(modalKind);
    const isLoading = modalKind && !auditory;

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        isLoading={isLoading}
      >
        <div className={cx("from__item")}>
          <FormItem label="Название" hasFeedback>
            {getFieldDecorator("lastName", {
              initialValue: auditory ? auditory.name : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите название" }]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("from__item form__item_last-elem")}>
          <FormItem label="Вместимость" hasFeedback>
            {getFieldDecorator("phone", {
              initialValue: auditory ? auditory.capacity : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите  число" }]
            })(<InputNumber min={1} />)}
          </FormItem>
        </div>
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalAuditory);

export default connect<IStateToProps, IDispatchFromProps>(
  (state: IStore) => ({
    modal: state.modal
  }),
  dispatch => ({
    closeModal: closeModal(dispatch)
  })
)(modal);
