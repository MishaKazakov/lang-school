import * as React from "react";
import { IEvent } from "../../../models/event";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  event: IEvent;
}

class Event extends React.Component<IProps> {
  getPosition = (time: number[]) => (time[0] - 8) * 60 + time[1];

  getDuration = (startTime: number[], endTime: number[]) =>
    (endTime[0] - startTime[0]) * 60 + endTime[1] - startTime[1];

  formatTime = (time: number[]) =>
    `${this.placeZero(time[0])}:${this.placeZero(time[1])}`;

  placeZero = (num: number) => num.toString().padStart(2, "0");

  render() {
    const { event } = this.props;

    const startPosition = this.getPosition(event.timeStart);
    const duration = this.getDuration(event.timeStart, event.timeEnd);

    const startTime = this.formatTime(event.timeStart);
    const endTime = this.formatTime(event.timeEnd);

    return (
      <div
        className={cx("event")}
        style={{ top: startPosition, height: duration }}
      >
        <span className={cx("event__name")}>{event.name}</span>
        <div className={cx("event__time")}>
          с {startTime} до {endTime}
        </div>
        {duration > 45 && (
          <div className={cx("event__audience")}>{event.audience.name}</div>
        )}
      </div>
    );
  }
}

export default Event;
