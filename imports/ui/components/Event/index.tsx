import * as React from "react";
import { Link } from "react-router-dom";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";
import Button from "../Button";

const Icon = require("antd/lib/icon");
const Popover = require("antd/lib/popover");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  event: IEvent;
}

class Event extends React.Component<IProps> {
  getPosition = (time: number[]) => (time[0] - 8) * 60 + time[1];

  getDuration = (startTime: number[], endTime: number[]) =>
    (endTime[0] - startTime[0]) * 60 + endTime[1] - startTime[1];

  onEditClick = () => "";
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
    const { event } = this.props;

    const startPosition = this.getPosition(event.timeStart);
    const duration = this.getDuration(event.timeStart, event.timeEnd);

    const startTime = formatTime(event.timeStart);
    const endTime = formatTime(event.timeEnd);

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
            <div className={cx("event__audience")}>{event.audience.name}</div>
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

export default Event;
