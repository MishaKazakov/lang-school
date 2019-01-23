import * as React from "react";
import LogIn from "../../components/LogIn";

const cx = require("classnames/bind").bind(require("./style.scss"));

class LogInPage extends React.Component {
  render() {
    return (
      <div className={cx("login")}>
        <LogIn />
      </div>
    );
  }
}

export default LogInPage;
