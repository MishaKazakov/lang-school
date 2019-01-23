import * as React from "react";
import Event from "../Event";
import { withTracker } from "meteor/react-meteor-data";
import { IEvent } from "../../../models/event";
import { IAuditory } from "../../../models/auditory";
import GridRows from "../GridRows";

import { Events } from "../../../api/events";
import { Auditories } from "../../../api/auditories";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IDataProps {
  events: any;
  auditories: any;
}

interface IProps {
  date: Date;
  events?: IEvent[];
  auditories?: IAuditory[];
  itemId: string;
  category: string;
}

// чтобы занятие появилось нужно открыть другую консоль
// войти в режим редактирования meteor mongo
// и вставить
// db.events.insert({name:"Английский", date: new Date(), timeStart: [12,0], timeEnd:[14,0], auditoryId: "wYAwfXSYeDMPgXv9w" })

class Grid extends React.PureComponent<IProps & IDataProps> {
  prepareEvents = (events: IEvent[]) => {
    let schedule = new Array(7).fill(0);
    schedule.forEach((v, i) => (schedule[i] = new Array()));
    let earliestHour = 25;

    events.forEach(e => {
      const eventHour = e.timeStart[0];
      if (eventHour < earliestHour) {
        earliestHour = eventHour;
      }

      if (e.date.getDay() === 0) {
        schedule[6].push(e);
      } else {
        const day = e.date.getDay() - 1;
        schedule[day].push(e);
      }
    });

    return { schedule, earliestHour };
  };

  scrollPage = (hour: number) => {
    if (hour === 25 || hour === 0) {
      return;
    }

    setTimeout(
      () =>
        document.querySelector(".schedule").scrollTo(0, 60 * (hour - 1) + 1),
      0
    );
  };

  render() {
    const { events, auditories, itemId, category } = this.props;
    const { schedule, earliestHour } = this.prepareEvents(events);
    this.scrollPage(earliestHour);

    return (
      <div className={cx("grid")}>
        {GridRows()}
        <div className={cx("gird__columns-wrapper")}>
          {schedule.map((day, i) => (
            <div key={i} className={cx("gird__column")}>
              {day.length !== 0 &&
                day.map(e => (
                  <Event
                    itemId={itemId}
                    auditories={auditories}
                    event={e}
                    key={e._id}
                    category={category}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withTracker<IDataProps, IProps>(({ date: monday, itemId }) => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    events: Events.find({
      date: {
        $lte: sunday,
        $gte: monday
      },
      visible: true,
      $or: [{ auditoryId: itemId }, { teachersId: itemId }, { groupId: itemId }]
    }).fetch(),
    auditories: Auditories.find().fetch()
  };
})(Grid);
