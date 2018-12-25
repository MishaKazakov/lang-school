import * as React from "react";
import Weekdays from "../Weekdays";
import TimeRuler from "../TimeRuler";
import Grid from "../Grid";

const cx = require("classnames/bind").bind(require("./style.scss"));
const monday = new Date(2018, 10, 22);

interface IProps {
  date: Date;
}

class Schedule extends React.Component<IProps> {
  render() {
    const { date } = this.props;
    return (
      <div className={cx("schedule")}>
        <Weekdays className={cx("schedule__weekdays")} startDay={date} />
        <div className={cx("schedule__table")}>
          <TimeRuler />
          <Grid date={date} />
        </div>
      </div>
    );
  }
}

export default Schedule;
