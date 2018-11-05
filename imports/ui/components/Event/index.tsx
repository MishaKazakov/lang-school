import * as React from "react";
import { Location, History } from "history";
import { withRouter, match } from "react-router";
import { IEvent } from "../../../models/event";
import { formatTime } from "../../../helpers/string";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  event: IEvent;
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

class Event extends React.Component<IProps> {
  getPosition = (time: number[]) => (time[0] - 8) * 60 + time[1];

  getDuration = (startTime: number[], endTime: number[]) =>
    (endTime[0] - startTime[0]) * 60 + endTime[1] - startTime[1];

  toAttendance = () => this.props.history.push("/attendance");

  render() {
    const { event } = this.props;

    const startPosition = this.getPosition(event.timeStart);
    const duration = this.getDuration(event.timeStart, event.timeEnd);

    const startTime = formatTime(event.timeStart);
    const endTime = formatTime(event.timeEnd);

    return (
      <div
        className={cx("event")}
        style={{ top: startPosition, height: duration }}
        onClick={this.toAttendance}
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

export default withRouter<IProps>(Event);
