import * as React from "react";
import Button from "../Button";
import MenuItem from "../MenuItem";

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
  open: string;
  onClick: (url: string) => void;
}

class MenuCategory extends React.Component<IProps> {
  onAddClick = (name: string) => console.log(`add new ${name}`);
  onEditClick = _id => console.log(`item ${_id}`);

  render() {
    const { name, url, open } = this.props;
    const address = "/" + url;
    const isOpen = open === url;
    const onAdd = () => this.onAddClick(url);
    const onClick = () => this.props.onClick(url);

    return (
      <div className={cx("menu-category")}>
        <button
          onClick={onClick}
          className={cx("menu-category__link", {
            "menu-category__link_selected": isOpen
          })}
        >
          {name}
        </button>
        {isOpen && (
          <div className={cx("menu-category__list")}>
            {items.map(item => (
              <MenuItem item={item} url={address} onClick={this.onEditClick} />
            ))}
            <Button
              icon={Button.ICON.ADD}
              size={Button.SIZE.SMALL}
              onlyIcon
              onClick={onAdd}
            />
          </div>
        )}
      </div>
    );
  }
}

export default MenuCategory;
