import * as React from "react";
import Header from "../Header";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  children: any;
  title?: string;
}

class Layout extends React.Component<IProps> {
  render() {
    const { children, title } = this.props;

    return (
      <div className={cx("layout")}>
        <Header />
        {title && <div className={cx("layout__title")}>{title}</div>}
        {children}
      </div>
    );
  }
}

export default Layout;
