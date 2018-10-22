import * as React from "react";

const cx = require("classnames/bind").bind(require("./style.scss"));

class Grid extends React.Component {
  render() {
    const days = Array.from({length: 15}, (v, k) => k+1);

    return (
      <div className={cx("grid")}>
        {days.map(v => (
          <div key={v} className={cx("grid__row")} />
        ))}
      </div>
    );
  }
}

export default Grid;
