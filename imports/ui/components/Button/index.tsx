import * as React from "react";
const AntButton = require("antd/lib/button");
require("antd/lib/button/style/css");

const cx = require("classnames/bind").bind(require("./style.scss"));

enum Size {
  LARGE = "large",
  SMALL = "small"
}

enum Type {
  PRIMARY = "primary",
  DASHED = "dashed",
  DANGER = "danger"
}

enum Icon {
  EDIT = "edit",
  ADD = "plus-circle"
}

interface IProps {
  type?: Type;
  icon?: Icon;
  size?: Size;
  children?: any;
  disabled?: boolean;
  onClick?: (event?: React.SyntheticEvent<any>) => void;
  onlyIcon?: boolean;
}

class Button extends React.PureComponent<IProps> {
  static TYPE = Type;
  static ICON = Icon;
  static SIZE = Size;
  render() {
    const {
      onClick,
      type,
      children,
      disabled,
      icon,
      onlyIcon,
      size
    } = this.props;
    const shape = icon ? "circle" : "";

    return (
      <span className={cx({ "button_only-icon": onlyIcon })}>
        <AntButton
          type={type}
          shape={shape}
          size={size}
          onClick={onClick}
          disabled={disabled}
          icon={icon}
        >
          {children}
        </AntButton>
      </span>
    );
  }
}

export default Button;
