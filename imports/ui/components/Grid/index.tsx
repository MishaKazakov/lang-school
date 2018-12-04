import * as React from "react";
import Event from "../Event";
import { IEvent } from "../../../models/event";
import { withTracker } from "meteor/react-meteor-data";
import { Events } from "../../../api/events";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  events: IEvent[];
}

// чтобы занятие появилось нужно открыть другую консоль
// войти в режим редактирования meteor mongo
// и вставить db.events.insert({name:"Английский", date: new Date(), timeStart: [12,0], timeEnd:[14,0], audience:{name: "Нью-Йорк"}})

class Grid extends React.Component<IProps> {
  prepareEvents = (events: IEvent[]) => {
    let schedule = new Array(7).fill(0);
    schedule.forEach((v, i) => (schedule[i] = new Array()));

    events.forEach(e => {
      if (e.date.getDay() === 0) {
        schedule[6].push(e);
      } else {
        const day = e.date.getDay() - 1;
        schedule[day].push(e);
      }
    });

    return schedule;
  };

  render() {
    const times = Array.from({ length: 15 }, (v, i) => i + 1);
    const schedule = this.prepareEvents(this.props.events);

    return (
      <div className={cx("grid")}>
        {times.map(v => (
          <div key={v} className={cx("grid__row")} />
        ))}
        <div className={cx("columns")}>
          {schedule.map((day, i) => (
            <div key={i} className={cx("columns__item")}>
              <div className={cx("columns__line-wrapper")}>
                {day.length !== 0 &&
                  day.map(e => <Event key={e.name} event={e} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    events: Events.find({}).fetch()
  };
})(Grid);
