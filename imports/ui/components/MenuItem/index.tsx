import * as React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

const cx = require("classnames/bind").bind(require("./style.scss"));

export default function add({ item, onClick, url }) {
  const onEditClick = () => onClick(item._id);
  const label = item.name ? item.name : `${item.lastName} ${item.firstName}`;

  return (
    <div>
      <Link id={item._id} className={cx("link")} to={`${url}?id=${item._id}`}>
        {label}
      </Link>
      <Button
        icon={Button.ICON.EDIT}
        size={Button.SIZE.SMALL}
        onlyIcon
        onClick={onEditClick}
      />
    </div>
  );
}
