import * as React from "react";
import { Link } from "react-router-dom";
import Edit from "../Edit";

const cx = require("classnames/bind").bind(require("./style.scss"));

export default function add({ item, onClick }) {
  const onEditClick = () => onClick(item._id);

  return (
    <div>
      <Link id={item._id} className={cx("link")} to={`/group/${item._id}`}>
        {item.name}
      </Link>
      <Edit onClick={onEditClick} />
    </div>
  );
}
