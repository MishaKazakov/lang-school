import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  startDay: Date;
  className?: string;
}

class Weekdays extends React.Component<IProps> {
  createWeek = () => {
    let day = this.props.startDay;
    let week = [];

    for (let i = 0; i < 7; i++) {
      week.push(day.getDate() + i);
    }
    return week;
  };

  render() {
    const week = this.createWeek();
    const dayNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    const { className } = this.props;

    return (
      <div className={cx("weekdays", className)}>
        {week.map((day, i) => (
          <div key={day} className={cx("weekdays__day")}>
            <div className={cx("weekdays__number")}>
              {day}
              <div className={cx("weekdays__name-wrapper")}>
                <div className={cx("weekdays__name")}>{dayNames[i]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Weekdays;
