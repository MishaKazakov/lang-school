import * as React from "react";
import Button from "../Button";
import ModalConfirmDelete from "../ModalConfirmDelete";

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
  onDelete: () => void;
  onSubmit: (data) => void;
  showDelete?: boolean;
}

interface IState {
  isConfirmVisible: boolean;
}

class ModalForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmVisible: false
    };
  }
  onClose = () => {
    this.props.form.resetFields();
    this.props.onClose && this.props.onClose();
  };

  onSubmit = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.onSubmit && this.props.onSubmit(values);
        this.onClose();
      }
    });
  };

  toggleConfirm = () =>
    this.setState(state => ({ isConfirmVisible: !state.isConfirmVisible }));

  onDeleteConfirmed = () => {
    this.toggleConfirm();
    this.props.onDelete && this.props.onDelete();
    this.onClose();
  };

  render() {
    const { visible, children, title, isLoading, showDelete } = this.props;
    const { isConfirmVisible } = this.state;

    return (
      <Modal
        visible={visible}
        title={title}
        onCancel={this.onClose}
        footer={[
          showDelete && (
            <Button
              key="delete"
              type={Button.TYPE.DANGER}
              className={cx("form__delete-button")}
              onClick={this.toggleConfirm}
            >
              Удалить
            </Button>
          ),
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
        <ModalConfirmDelete
          visible={isConfirmVisible}
          onCancelClick={this.toggleConfirm}
          onConfirmClick={this.onDeleteConfirmed}
        />
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
