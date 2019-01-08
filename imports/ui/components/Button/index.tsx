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
  ADD = "plus-circle",
  REMOVE = "close-circle"
}

enum HtmlType {
  SUBMIT = "submit",
  RESET = "reset"
}

interface IProps {
  type?: Type;
  icon?: Icon;
  size?: Size;
  htmlType?: HtmlType;
  ghost?: boolean;
  children?: any;
  disabled?: boolean;
  onClick?: (event?: React.SyntheticEvent<any>) => void;
  onlyIcon?: boolean;
  className?: string;
}

class Button extends React.PureComponent<IProps> {
  static TYPE = Type;
  static ICON = Icon;
  static SIZE = Size;
  static HTMLTYPE = HtmlType;

  render() {
    const {
      onClick,
      type,
      children,
      disabled,
      icon,
      onlyIcon,
      size,
      htmlType,
      className,
      ghost
    } = this.props;
    const shape = icon ? "circle" : null;

    const button = (
      <AntButton
        type={type}
        shape={shape}
        size={size}
        onClick={onClick}
        disabled={disabled}
        icon={icon}
        htmlType={htmlType}
        ghost={ghost}
        className={className}
      >
        {children}
      </AntButton>
    );

    if (onlyIcon) {
      return (
        <span className={cx({ "button_only-icon": onlyIcon })}>{button}</span>
      );
    }

    return button;
  }
}

export default Button;
