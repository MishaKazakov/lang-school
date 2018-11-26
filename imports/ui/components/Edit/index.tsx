import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

export default function edit({ onClick }) {
  return (
    <button type="button" onClick={onClick} className={cx("edit")}>
      ✏️
    </button>
  );
}
