import * as React from "react";
import MenuCategory from "../MenuCategory";
import { Location, History } from "history";
import { withRouter, match } from "react-router";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  className?: string;
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

interface IState {
  category: string;
}

class Menu extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    const path = props.location.pathname.substr(1);
    this.state = {
      category: path || "group"
    };
  }

  changeCategory = (category: string) => this.setState({ category });

  render() {
    const { className } = this.props;
    const { category } = this.state;

    return (
      <div className={cx("panel", className)}>
        <MenuCategory
          onClick={this.changeCategory}
          open={category}
          name="Группы"
          url="group"
        />
        <MenuCategory
          onClick={this.changeCategory}
          open={category}
          name="Аудитории"
          url="auditory"
        />
        <MenuCategory
          onClick={this.changeCategory}
          open={category}
          name="Преродаватели"
          url="teacher"
        />
        <MenuCategory
          onClick={this.changeCategory}
          open={category}
          name="Мероприятия"
          url="event"
        />
        <MenuCategory
          onClick={this.changeCategory}
          open={category}
          name="Онлайн"
          url="online"
        />
      </div>
    );
  }
}

export default withRouter<IProps>(Menu);
