import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

const GridRows = () => {
  const times = Array.from({ length: 23 }, (v, i) => i + 1);

  return times.map(i => (
    <div
      key={i}
      style={{ height: `${60 * i}px` }}
      className={cx("grid__row")}
    />
  ));
};

export default GridRows;
