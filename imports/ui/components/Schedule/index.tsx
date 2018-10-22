import * as React from "react";
import Weekdays from "../Weekdays";
import TimeRuler from "../TimeRuler";
import Grid from "../Grid";

const cx = require("classnames/bind").bind(require("./style.scss"));

class Schedule extends React.Component {
  render() {
    const monday = new Date(2018, 10, 22);

    return (
      <div className={cx("schedule")}>
        <Weekdays
          className={cx("schedule__weekdays")}
          startDay={monday}
        />
        <div className={cx("schedule__table")}>
          <TimeRuler />
          <Grid />
        </div>
      </div>
    );
  }
}

export default Schedule;
