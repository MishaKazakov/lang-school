import * as React from "react";
import Button from "../Button";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  title: string | boolean;
  hide?: boolean;
  onClick: () => void;
}

class AddPanel extends React.Component<IProps> {
  render() {
    const { title, hide, onClick } = this.props;

    return (
      <div className={cx("add-panel")}>
        <div className={cx("add-panel__title")}>{title}</div>
        <Button
          onClick={onClick}
          type={Button.TYPE.PRIMARY}
          className={cx({ "add-panel_hide": hide })}
        >
          Добавить
        </Button>
      </div>
    );
  }
}

export default AddPanel;
