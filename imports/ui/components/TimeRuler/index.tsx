import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

class TimeRuler extends React.Component {
  createTimeRuler = () => {
    let time = [];
    for (let i = 8; i < 23; i++) {
      const nextNum = i < 10 ? "0" + i : i;
      time.push(nextNum + ":00");
    }
    return time;
  };

  render() {
    const time = this.createTimeRuler();
    
    return (
      <div className={cx("time-ruler")}>
        {time.map(item => (
          <div key={item} className={cx("time-ruler__item")}>{item}</div>
        ))}
      </div>
    );
  }
}

export default TimeRuler;
