import * as React from "react";
import Add from "../Add";
import PanelItem from "../PanelItem";
import { Link } from "react-router-dom";
import { Location, History } from "history";
import { withRouter, match } from "react-router";

const cx = require("classnames/bind").bind(require("./style.scss"));

const items = [
  {
    _id: "1",
    name: "Английский"
  },
  { _id: "2", name: "Немецкий" },
  { _id: "3", name: "Французкий" }
];

interface IProps {
  name: string;
  url: string;
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

class PanelMenu extends React.Component<IProps> {
  onAddClick = (name: string) => console.log(`add new ${name}`);
  onEditClick = _id => console.log(`item ${_id}`);

  render() {
    const { name, url } = this.props;
    const mURL = url ? "/" + url : "/";
    const isOpen = this.props.location.pathname === mURL;
    const onAdd = () => this.onAddClick(url);

    return (
      <div className={cx("panel-menu")}>
        <Link
          to={mURL}
          className={cx("panel-menu__link", {
            "panel-menu__link_selected": isOpen
          })}
        >
          {name}
        </Link>
        {isOpen && (
          <div className={cx("panel-menu__list")}>
            {items.map(item => (
              <PanelItem item={item} onClick={this.onEditClick} />
            ))}
            <Add onClick={onAdd} />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter<IProps>(PanelMenu);
