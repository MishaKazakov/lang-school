import * as React from "react";
import { Link } from "react-router-dom";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";
import { IAuditory } from "../../../models/auditory";
import Button from "../Button";

import { connect } from "react-redux";
import { openModal } from "../../reducers/modalReducer";

const Icon = require("antd/lib/icon");
const Popover = require("antd/lib/popover");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  event: IEvent;
  auditories: IAuditory[];
}

interface IDispatchFromProps {
  openModal: (name: string, extra?: any) => void;
}

class Event extends React.Component<IProps & IDispatchFromProps> {
  getPosition = (time: number[]) => (time[0] - 8) * 60 + time[1];

  getDuration = (startTime: number[], endTime: number[]) =>
    (endTime[0] - startTime[0]) * 60 + endTime[1] - startTime[1];

  onEditClick = () => {
    const { openModal, event } = this.props;
    openModal("group-element", event._id);
  };

  onDeleteClick = () => "";

  popoverContent = (
    <div className={cx("popover")}>
      <Button
        type={Button.TYPE.PRIMARY}
        ghost
        className={cx("popover__button")}
        onClick={this.onEditClick}
      >
        Редактировать
      </Button>
      <Button
        type={Button.TYPE.PRIMARY}
        ghost
        className={cx("popover__button")}
        onClick={this.onDeleteClick}
      >
        Удалить
      </Button>
    </div>
  );

  render() {
    const { event, auditories } = this.props;

    const startPosition = this.getPosition(event.timeStart);
    const duration = this.getDuration(event.timeStart, event.timeEnd);

    const startTime = formatTime(event.timeStart);
    const endTime = formatTime(event.timeEnd);

    const auditoryName =
      auditories &&
      auditories.find(auditory => auditory._id === event.auditoryId).name;

    return (
      <div
        className={cx("event__wrapper")}
        style={{ top: startPosition, height: duration }}
      >
        <Link to="/attendance" className={cx("event")}>
          <span className={cx("event__name")}>{event.name}</span>
          <div className={cx("event__time")}>
            с {startTime} до {endTime}
          </div>
          {duration > 45 && (
            <div className={cx("event__auditory")}>{auditoryName}</div>
          )}
        </Link>
        <Popover content={this.popoverContent} placement="right">
          <div className={cx("event__edit")}>
            <Icon type="edit" className={cx("edit")} />
          </div>
        </Popover>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    openModal: openModal(dispatch)
  })
)(Event);
