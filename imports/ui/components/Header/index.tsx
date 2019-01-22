import * as React from "react";
import { Link } from "react-router-dom";
import { Location, History } from "history";
import { withRouter, match } from "react-router";
import AccountControlWrapper from "../AccountControlWrapper";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

class Students extends React.Component<IProps> {
  render() {
    return (
      <header className={cx("header")}>
        <Link to="/" className={cx("header__text")}>
          Главная
        </Link>
        <Link to="/students" className={cx("header__text")}>
          Студенты
        </Link>
        <AccountControlWrapper />
      </header>
    );
  }
}

export default withRouter<IProps>(Students);
