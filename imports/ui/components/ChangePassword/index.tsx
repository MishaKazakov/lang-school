import * as React from "react";
import Button from "../Button";
import { FormComponentProps as FormProps } from "antd/lib/form";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

const cx = require("classnames/bind").bind(require("./style.scss"));

const Modal = require("antd/lib/modal");
const Alert = require("antd/lib/alert");
const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const message = require("antd/lib/message");

interface IProps {}

interface IPasswordChange {
  oldPassword: string;
  newPassword: string;
}

interface IState {
  visible: boolean;
  error: boolean;
}

class ChangePassword extends React.Component<FormProps & IProps, IState> {
  constructor(props) {
    super(props);

    this.state = { visible: false, error: false };
  }

  handleChange = (data: IPasswordChange) => {
    if (Meteor.isClient)
      Accounts.changePassword(data.oldPassword, data.newPassword, error => {
        if (error) {
          this.setState({ error: true });
        } else {
          this.closeModal();
          message.success(
            "Пароль успешно изменен",
            5
          );
        }
      });
  };

  onSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.handleChange(values);
      }
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, error } = this.state;
    return (
      <div>
        <Button
          type={Button.TYPE.PRIMARY}
          onClick={this.showModal}
        >
          Изменить пароль
        </Button>

        <Modal
          title="Изменение пароля"
          visible={visible}
          onCancel={this.closeModal}
          footer={[
            <Button
              key="close"
              className={cx("form__button")}
              onClick={this.closeModal}
            >
              Закрыть
            </Button>,
            <Button
              key="submit"
              onClick={this.onSubmit}
              className={cx("form__button")}
              type={Button.TYPE.PRIMARY}
              htmlType={Button.HTMLTYPE.SUBMIT}
            >
              Сохранить
            </Button>
          ]}
        >
          <Form onSubmit={this.onSubmit} className={cx("form")}>
            <div className={cx("from__item")}>
              <FormItem label="Старый пароль" hasFeedback>
                {getFieldDecorator("oldPassword", {
                  validateTrigger: ["onBlur", "onChange"],
                  rules: [{ required: true, message: "Введите старый пароль" }]
                })(
                  <Input
                    type="password"
                    onChange={() => this.setState({ error: false })}
                  />
                )}
              </FormItem>
              {error && <Alert type="error" message="Неверный пароль" />}
            </div>
            <div className={cx("from__item form__item_last-elem")}>
              <FormItem label="Новый пароль" hasFeedback>
                {getFieldDecorator("newPassword", {
                  validateTrigger: ["onBlur", "onChange"],
                  rules: [{ required: true, message: "Введите новый пароль" }]
                })(<Input type="password" />)}
              </FormItem>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

const form = Form.create()(ChangePassword);
export default form;
