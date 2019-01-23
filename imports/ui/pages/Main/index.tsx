import * as React from "react";
import Layout from "../../components/Layout";
import Schedule from "../../components/Schedule";
import Menu from "../../components/Menu";
import Calendar from "react-calendar";
import MenuModals from "../../components/MenuModals";
import { Location, History } from "history";
import { withRouter, match } from "react-router";
import AddPanel from "../../components/AddPanel";
import Weekdays from "../../components/Weekdays";

import * as qs from "query-string";
import * as moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

import { Activities } from "../../../api/activities";
import { Auditories } from "../../../api/auditories";
import { Teachers } from "../../../api/teachers";
import { Groups } from "../../../api/groups";

// redux
import { compose } from "redux";
import { connect } from "react-redux";
import { openModal } from "../../reducers/modalReducer";
import { Meteor } from "meteor/meteor";
import { ITeacher } from "imports/models/teacher";
import { IUser } from "imports/models/user";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
  item: any;
  user: IUser;
}

interface IDispatchFromProps {
  openModal: (name: string, extra?: any, group?: string) => void;
}

interface IState {
  date: Date;
  calendarDate: Date;
  category: string;
  itemId: string;
  checkedForTeacher: boolean;
}

const categories = [
  {
    name: "Группы",
    singleName: "Группа",
    url: "group"
  },
  {
    name: "Аудитории",
    singleName: "Аудитория",
    url: "auditory"
  },
  {
    name: "Преподаватели",
    singleName: "Преподаватель",
    url: "teacher"
  },
  {
    name: "Мероприятия",
    singleName: "Мероприятие",
    url: "activity"
  }
];

const adminOnlyCategories = ["teacher", "auditory"];

class Main extends React.Component<IProps & IDispatchFromProps, IState> {
  constructor(props) {
    super(props);

    const location = props.location;
    const path = location.pathname.substr(1);
    const id = qs.parse(location.search)["id"];
    this.state = {
      date: this.getMonday(new Date()),
      calendarDate: new Date(),
      category: path || "group",
      itemId: id,
      checkedForTeacher: false
    };
  }

  getMonday = (date: Date) =>
    moment(date)
      .startOf("week")
      .toDate();

  historyListener;

  componentDidMount() {
    this.historyListener = this.props.history.listen(location => {
      const id = qs.parse(location.search)["id"];
      this.setState({ itemId: id, checkedForTeacher: false });
    });
  }

  componentWillUnmount() {
    this.historyListener();
  }

  addElement = () => {
    const modal = "element-" + this.state.category;
    this.props.openModal(modal, null, this.state.itemId);
  };

  changeCategory = (category: string) => this.setState({ category });

  onDateChange = (newDate: Date) => {
    this.setState({
      date: this.getMonday(newDate),
      calendarDate: newDate
    });
  };

  checkForTeacher = (user: { _id: string; profile: { role: string } }) => {
    if (this.props.location.pathname.substr(1) === "") {
      if (user.profile.role === "teacher") {
        const teacher = Teachers.findOne({ userId: user._id }) as ITeacher;
        this.setState({
          category: "teacher",
          itemId: teacher._id
        });
      }
    }
    this.setState({ checkedForTeacher: true });
  };

  render() {
    const {
      date,
      category,
      calendarDate,
      itemId,
      checkedForTeacher
    } = this.state;
    const { item, user } = this.props;
    user && !checkedForTeacher && this.checkForTeacher(user);
    const curCategory = categories.find(item => item.url === category);
    const categoryName = itemId ? curCategory.singleName : curCategory.name;
    const hideAdd = !itemId || !["group", "activity"].includes(category);
    const itemTitle = item
      ? item.name
        ? item.name
        : `${item.lastName} ${item.firstName}`
      : "";
    const title = `${categoryName} ${itemTitle}`;
    
    return (
      <Layout>
        <MenuModals />
        <AddPanel title={title} hide={hideAdd} onClick={this.addElement} />
        <div className={cx("main")}>
          <Weekdays startDay={date} />
          <Schedule itemId={itemId} date={date} category={category} />
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
              categories={categories.filter(
                (c: { name: string; singleName: string; url: string }) =>
                  !adminOnlyCategories.includes(c.url) ||
                  (user && user.profile.role === "admin")
              )}
              onChangeCategory={this.changeCategory}
              className={cx("main__menu")}
            />
          </div>
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
  ),
  withTracker<any, IProps>(({ location }) => {
    const _id = qs.parse(location.search)["id"];

    const items = [
      Auditories.findOne({ _id }),
      Teachers.findOne({ _id }),
      Groups.findOne({ _id }),
      Activities.findOne({ _id })
    ];

    return {
      item: items.find(item => !!item),
      user: Meteor.user() as IUser
    };
  })
)(Main);
