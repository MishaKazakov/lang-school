import * as React from "react";
import { Link } from "react-router-dom";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";
import { IAuditory } from "../../../models/auditory";

import { connect } from "react-redux";
import { openModal } from "../../reducers/modalReducer";

const Icon = require("antd/lib/icon");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  event: IEvent;
  auditories: IAuditory[];
  itemId: string;
}

interface IDispatchFromProps {
  openModal: (name: string, extra?: any, itemId?: string) => void;
}

class Event extends React.Component<IProps & IDispatchFromProps> {
  getPosition = (time: number[]) => (time[0] - 8) * 60 + time[1];

  getDuration = (startTime: number[], endTime: number[]) =>
    (endTime[0] - startTime[0]) * 60 + endTime[1] - startTime[1];

  onEditClick = () => {
    const { openModal, event, itemId } = this.props;
    openModal("element-group", event._id, itemId);
  };

  onDeleteClick = () => "";

  render() {
    const { event, auditories } = this.props;

    const startPosition = this.getPosition(event.timeStart);
    const duration = this.getDuration(event.timeStart, event.timeEnd);

    const startTime = formatTime(event.timeStart);
    const endTime = formatTime(event.timeEnd);

    const auditory =
      auditories &&
      auditories.find &&
      auditories.find(auditory => auditory._id === event.auditoryId);
    const auditoryName = auditory ? auditory.name : "";

    return (
      <div
        className={cx("event__wrapper")}
        style={{ top: startPosition, height: duration }}
      >
        <Link to="/attendance" className={cx("event")}>
          <div className={cx("event__name-wrapper")}>
            <span className={cx("event__name")}>{event.name}</span>
          </div>
          <div className={cx("event__time")}>
            с {startTime} до {endTime}
          </div>
          {duration > 50 && (
            <div className={cx("event__auditory")}>{auditoryName}</div>
          )}
        </Link>
        <button className={cx("event__edit")} onClick={this.onEditClick}>
          <Icon type="edit" className={cx("edit")} />
        </button>
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
