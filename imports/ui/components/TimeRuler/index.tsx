import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

class TimeRuler extends React.Component {
  createTimeRuler = () => {
    let time = [];

    for (let i = 0; i < 24; i++) {
      const nextNum = i.toString().padStart(2, "0");
      time.push(nextNum + ":00");
    }

    return time;
  };

  render() {
    const time = this.createTimeRuler();

    return (
      <div className={cx("time-ruler")}>
        {time.map(hour => (
          <div key={hour} className={cx("time-ruler__hour")}>
            {hour}
          </div>
        ))}
      </div>
    );
  }
}

export default TimeRuler;
