import * as React from "react";
import Button from "../Button";

const Modal = require("antd/lib/modal");
const Loader = require("antd/lib/spin");
const Form = require("antd/lib/form");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  title: string;
  form: any;
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
}

class ModalForm extends React.Component<IProps> {
  onClose = () => {
    this.props.form.resetFields();
    this.props.onClose();
  };

  onSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.onClose();
      }
    });
  };

  render() {
    const { visible, children, title, isLoading } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        onCancel={this.onClose}
        footer={[
          <Button
            key="close"
            className={cx("form__button")}
            onClick={this.onClose}
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
        <Form onClose={this.onClose}>
          {isLoading ? (
            <div className={cx("form__loader")}>
              <Loader />
            </div>
          ) : (
            children
          )}
        </Form>
      </Modal>
    );
  }
}

export default ModalForm;
