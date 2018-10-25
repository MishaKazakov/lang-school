import * as React from "react";
import Header from "../Header";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  children: any;
}

class Layout extends React.Component<IProps> {
  render() {
    const { children } = this.props;

    return (
      <div className={cx("layout")}>
        <Header/>
        {children}
      </div>
    );
  }
}

export default Layout;
