import * as React from "react";
import { Link } from "react-router-dom";
import { Location, History } from "history";
import { withRouter, match } from "react-router";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

class Students extends React.Component<IProps> {
  render() {
    const isMain = this.props.location.pathname === "/";

    return (
      <header className={cx("header")}>
        <Link
          to="/"
          className={cx("header__text", { header__text_active: isMain })}
        >
          Языковая школа
        </Link>
        <Link
          to="/students"
          className={cx("header__text", { header__text_active: !isMain })}
        >
          Студенты
        </Link>
      </header>
    );
  }
}

export default withRouter<IProps>(Students);
