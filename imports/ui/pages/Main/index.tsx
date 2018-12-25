import * as React from "react";
import Layout from "../../components/Layout";
import Schedule from "../../components/Schedule";
import Menu from "../../components/Menu";
import Calendar from "react-calendar";
import MenuModals from "../../components/MenuModals";
import { Location, History } from "history";
import { withRouter, match } from "react-router";
import AddPanel from "../../components/AddPanel";

// redux
import { compose } from "redux";
import { connect } from "react-redux";
import { openModal } from "../../reducers/modalReducer";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

interface IDispatchFromProps {
  openModal: (name: string, extra?: any) => void;
}

interface IState {
  date: Date;
  calendarDate: Date;
  category: string;
}

class Main extends React.Component<IProps & IDispatchFromProps, IState> {
  constructor(props) {
    super(props);

    const path = props.location.pathname.substr(1);
    this.state = {
      date: this.getMonday(new Date()),
      calendarDate: new Date(),
      category: path || "group"
    };
  }

  addElement = () => {
    const modal = this.state.category + "-element";
    this.props.openModal(modal);
  };

  changeCategory = (category: string) => this.setState({ category });

  getMonday = (d: Date) => {
    const day = new Date();
    const dayNum = d.getDay() === 0 ? 6 : d.getDay() - 1;
    day.setDate(d.getDate() - dayNum);

    return day;
  };

  onDateChange = (newDate: Date) => {
    this.setState({
      date: this.getMonday(newDate),
      calendarDate: newDate
    });
  };

  withAddButton = ["group", "event"];

  render() {
    const { date, category, calendarDate } = this.state;
    const hideAdd = !this.withAddButton.includes(category);

    return (
      <Layout>
        <MenuModals />
        <AddPanel hide={hideAdd} onClick={this.addElement} />
        <div className={cx("main")}>
          <div className={cx("main__panel")}>
            <Calendar
              value={calendarDate}
              onChange={this.onDateChange}
              className={cx("main__calendar")}
              prev2Label={null}
              next2Label={null}
            />
            <Menu
              category={category}
              onChangeCategory={this.changeCategory}
              className={cx("main__menu")}
            />
          </div>
          <Schedule date={date} />
        </div>
      </Layout>
    );
  }
}

export default compose(
  withRouter,
  connect(
    null,
    dispatch => ({
      openModal: openModal(dispatch)
    })
  )
)(Main);
