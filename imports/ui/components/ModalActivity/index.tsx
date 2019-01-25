import * as React from "react";
import { connect } from "react-redux";
import { ISwitch } from "../../../models/switch";
import { IStore } from "../../../models/store";
import { IActivity } from "../../../models/activity";
import { IEvent } from "../../../models/event";
import { closeModal } from "../../reducers/modalReducer";
import { FormComponentProps as FormProps } from "antd/lib/form";
import ModalForm from "../ModalFrom";

import { Activities } from "../../../api/activities";
import { Events } from "../../../api/events";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";

const Form = require("antd/lib/form");
const FormItem = Form.Item;
const Input = require("antd/lib/input");
const InputNum = require("antd/lib/input-number");
const Checkbox = require("antd/lib/checkbox");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IStateToProps {
  modal: ISwitch;
}

interface IDispatchFromProps {
  closeModal: typeof closeModal;
}

interface IDataProps {
  activity: any;
}

interface IProps {
  activity: IActivity;
  activityEvents: IEvent[];
}

const name = "activity";

class ModalActivity extends React.Component<
  IStateToProps & IDispatchFromProps & FormProps & IProps
> {
  onClose = () => this.props.closeModal(name);

  onSubmit = (data: IActivity) => {
    const { activity } = this.props;
    const id = activity && activity._id;

    if (id) {
      Activities.update(
        { _id: id },
        {
          name: data.name,
          numberOfClasses: data.numberOfClasses,
          isInfinite: data.isInfinite
        }
      );
    } else {
      Activities.insert({
        name: data.name,
        numberOfClasses: data.numberOfClasses,
        isInfinite: data.isInfinite
      });
    }
  };

  onDelete = () => {
    const _id = this.props.activity._id;
    Activities.remove({ _id });
    
    const events = Events.find({ groupId: _id }).fetch();
    events.forEach((event: IEvent) => Events.remove({ _id: event._id }));
  };

  render() {
    const { form, modal, activity } = this.props;
    const { getFieldDecorator } = form;

    const modalKind = modal.extra;
    const isLoading = modalKind && !activity;

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
        <div className={cx("from__item ")}>
          <FormItem label="Название" hasFeedback>
            {getFieldDecorator("name", {
              initialValue: activity ? activity.name : "",
              validateTrigger: ["onBlur", "onChange"],
              rules: [{ required: true, message: "Введите название" }]
            })(<Input />)}
          </FormItem>
        </div>
        <div className={cx("from__item")}>
          <FormItem label="Количество" hasFeedback>
            {getFieldDecorator("numberOfClasses", {
              initialValue: activity ? activity.numberOfClasses : 1
            })(<InputNum min={1} />)}
          </FormItem>
        </div>
        <div
          className={cx("from__item form__item_last-elem form__item__checkbox")}
        >
          <FormItem label="Постоянное" hasFeedback>
            {getFieldDecorator("isInfinite", { initialValue: undefined })(
              <Checkbox />
            )}
          </FormItem>
        </div>
      </ModalForm>
    );
  }
}

const modal = Form.create()(ModalActivity);

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
    const activity = _id && Activities.findOne({ _id });

    return {
      activity
    };
  })
)(modal);
