import * as React from "react";
import TimeRuler from "../TimeRuler";
import Grid from "../Grid";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  date: Date;
  itemId: string | null;
  category: string;
}

class Schedule extends React.Component<IProps> {
  render() {
    const { date, itemId, category } = this.props;
    return (
      <div className={cx("schedule")}>
        <div className={cx("schedule__table")}>
          <TimeRuler />
          {itemId ? (
            <Grid itemId={itemId} date={date} category={category} />
          ) : (
            <div className={cx("schedule__nogroup")}>Выберите из списка</div>
          )}
        </div>
      </div>
    );
  }
}

export default Schedule;
