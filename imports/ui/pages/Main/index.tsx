import * as React from "react";
import Layout from "../../components/Layout";
import Schedule from "../../components/Schedule";
import Panel from "../../components/Panel";
import Calendar from "react-calendar";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IState {
  date: Date;
}

class Main extends React.Component<null, IState> {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date()
    };
  }

  getMonday = (d: Date) => {
    const day = new Date();
    const dayNum = d.getDay() === 0 ? 6 : d.getDay() - 1;
    day.setDate(d.getDate() - dayNum);

    return day;
  };

  onDateChange = (d: Date) => this.setState({ date: d });

  render() {
    const { date } = this.state;
    const day = this.getMonday(date);

    return (
      <Layout>
        <div className={cx("main")}>
          <div className={cx("main__panel")}>
            <Calendar
              value={date}
              onChange={this.onDateChange}
              prev2Label={null}
              next2Label={null}
            />
            <Panel />
          </div>
          <Schedule date={day} />
        </div>
      </Layout>
    );
  }
}

export default Main;
