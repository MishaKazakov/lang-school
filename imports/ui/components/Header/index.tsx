import * as React from "react";
const cx = require("classnames/bind").bind(require("./style.scss"));

class Students extends React.Component {
  render() {
    return (
      <header className={cx("header")}>
        <span className={cx("header__text")}> Языковая школа</span>
      </header>
    );
  }
}

export default Students;
