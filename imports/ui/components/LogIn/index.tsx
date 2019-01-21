import * as React from "react";
import { FormComponentProps as FormProps } from "antd/lib/form";
import Button from "../Button";
import { Meteor } from "meteor/meteor";
import { Redirect, withRouter, match } from "react-router";
import { Location, History } from "history";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const Loader = require("antd/lib/spin");
const Alert = require("antd/lib/alert");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface ILogInData {
  Email: string;
  Password: string;
}

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

interface IState {
  validateFail: boolean;
}

class LogIn extends React.Component<FormProps & IProps, IState> {
  constructor(props) {
    super(props);

    this.state = { validateFail: false };
  }
  onSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.handleLogIn(values);
      }
    });
  };

  handleLogIn = (data: ILogInData) => {
    Meteor.loginWithPassword(data.Email, data.Password, this.handleResult);
  };

  resetValidateStatus = () => {
    this.setState({ validateFail: false });
  };

  handleResult = e => {
    if (e) this.setState({ validateFail: true });
    else this.props.history.push("/");
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { validateFail } = this.state;
    const loggingIn = Meteor.loggingIn();
    if (Meteor.userId()) return <Redirect to="/" />;

    return loggingIn ? (
      <div className={cx("form__loader")}>
        <Loader />
      </div>
    ) : (
      <Form onSubmit={this.onSubmit} className={cx("form")}>
        {validateFail && (
          <div className={cx("from__item")}>
            <Alert type="error" message="Неверный email или пароль" />
          </div>
        )}
        <div className={cx("from__item")}>
          <FormItem label="Email" hasFeedback>
            {getFieldDecorator("Email", {
              validateTrigger: ["onBlur", "onChange"],
              rules: [
                { required: true, message: "Введите email" },
                {
                  pattern: /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                  message: "Введите email полностью"
                }
              ]
            })(<Input type="email" onChange={this.resetValidateStatus} />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Password" hasFeedback>
            {getFieldDecorator("Password", {
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите пароль" }]
            })(<Input type="password" onChange={this.resetValidateStatus} />)}
          </FormItem>
        </div>
        <Button
          type={Button.TYPE.PRIMARY}
          key="submit"
          className={cx("form__button-center")}
          onClick={this.onSubmit}
        >
          Log in
        </Button>
      </Form>
    );
  }
}

const form = Form.create()(LogIn);

export default withRouter<IProps>(form);
