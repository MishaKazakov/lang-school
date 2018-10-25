import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  startDay: Date;
  className?: string;
}

const dayNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

class Weekdays extends React.Component<IProps> {
  getWeek = (day: Date) => {
    let week = [];
    week.push(day.getDate());

    for (let i = 0; i < 6; i++) {
      day.setDate(day.getDate() + 1);
      week.push(day.getDate());
    }

    return week;
  };

  render() {
    const { className, startDay } = this.props;
    const week = this.getWeek(new Date(startDay));

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
