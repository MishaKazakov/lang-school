import * as React from "react";
import PanelMenu from "../PanelMenu";

const cx = require("classnames/bind").bind(require("./style.scss"));

class Panel extends React.Component {
  render() {
    return (
      <div className={cx("panel")}>
        <PanelMenu name="Группы" url="" />
        <PanelMenu name="Аудитории" url="audiences" />
        <PanelMenu name="Преродаватели" url="teachers" />
        <PanelMenu name="Мероприятия" url="events" />
        <PanelMenu name="Онлайн" url="online" />
      </div>
    );
  }
}

export default Panel;
