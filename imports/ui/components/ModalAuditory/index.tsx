import * as React from "react";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IAuditory } from "../../../models/auditory";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";

import { Auditories } from "../../../api/auditories";
import { Events } from "../../../api/events";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

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

interface IDataProps {
  auditory: any;
}

interface IProps {
  auditory: IAuditory;
}

const name = "auditory";

class ModalAuditory extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps
> {
  onClose = () => this.props.closeModal(name);

  onSubmit = (data: IAuditory) => {
    const { auditory } = this.props;
    const id = auditory && auditory._id;

    if (id) {
      Auditories.update(
        { _id: id },
        {
          name: data.name,
          capacity: data.capacity
        }
      );
    } else {
      Auditories.insert({
        name: data.name,
        capacity: data.capacity
      });
    }
  };

  onDelete = () => {
    const _id = this.props.auditory._id;

    Events.find({ group_id: _id }).count() && Events.remove({ group_id: _id });
    Auditories.remove({ _id });
  };

  render() {
    const { form, modal, auditory } = this.props;
    const { getFieldDecorator } = form;
    const modalKind = modal.extra;
    const title = modalKind ? "Редактирование" : "Создание";
    const isLoading = modalKind && !auditory;

    return (
      <ModalForm
        title={title}
        visible={modal[name]}
        form={form}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        onDelete={this.onDelete}
        showDelete={modalKind}
        isLoading={isLoading}
      >
        <div className={cx("from__item")}>
          <FormItem label="Название" hasFeedback>
            {getFieldDecorator("name", {
              initialValue: auditory ? auditory.name : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите название" }]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("from__item form__item_last-elem")}>
          <FormItem label="Вместимость" hasFeedback>
            {getFieldDecorator("capacity", {
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
    const auditory = _id && Auditories.findOne({ _id });

    return {
      auditory
    };
  })
)(modal);
