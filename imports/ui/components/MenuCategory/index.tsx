import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../Button";
import MenuItem from "../MenuItem";
import { openModal } from "../../reducers/modalReducer";

const cx = require("classnames/bind").bind(require("./style.scss"));

const items = [
  {
    _id: "1",
    name: "Английский"
  },
  { _id: "2", name: "Немецкий" },
  { _id: "3", name: "Французкий" }
];

interface IDispatchFromProps {
  openModal: (name: string, extra?: any) => void;
}

interface IProps {
  name: string;
  url: string;
  open: string;
  onClick: (url: string) => void;
}

class MenuCategory extends React.Component<IProps & IDispatchFromProps> {
  onAddClick = () => this.props.openModal(this.props.url);
  onEditClick = _id => this.props.openModal(this.props.url, _id);

  render() {
    const { name, url, open } = this.props;
    const address = "/" + url;
    const isOpen = open === url;
    const onClick = () => this.props.onClick(url);

    return (
      <div className={cx("menu-category")}>
        <Link
          to={address}
          onClick={onClick}
          className={cx("menu-category__link", {
            "menu-category__link_selected": isOpen
          })}
        >
          {name}
        </Link>
        {isOpen && (
          <div className={cx("menu-category__list")}>
            {items.map(item => (
              <MenuItem key={item._id} item={item} url={address} onClick={this.onEditClick} />
            ))}
            <Button
              icon={Button.ICON.ADD}
              size={Button.SIZE.SMALL}
              onlyIcon
              onClick={this.onAddClick}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    openModal: openModal(dispatch)
  })
)(MenuCategory);
