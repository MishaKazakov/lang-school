import * as React from "react";
import Button from "../Button";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  hide?: boolean;
  onClick: () => void;
}

class AddPanel extends React.Component<IProps> {
  render() {
    const { hide, onClick } = this.props;

    return (
      <div className={cx("add-panel")}>
        <Button
          onClick={onClick}
          type={Button.TYPE.PRIMARY}
          className={cx({ "add-panel__button_hide": hide })}
        >
          Добавить
        </Button>
      </div>
    );
  }
}

export default AddPanel;
