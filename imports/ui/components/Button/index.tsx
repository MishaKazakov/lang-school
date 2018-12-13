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

enum HtmlType {
  SUBMIT = "submit",
  RESET = "reset"
}

interface IProps {
  type?: Type;
  icon?: Icon;
  size?: Size;
  htmlType?: HtmlType;
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
      className
    } = this.props;
    const shape = icon ? "circle" : null;

    return (
      <span className={cx({ "button_only-icon": onlyIcon })}>
        <AntButton
          type={type}
          shape={shape}
          size={size}
          onClick={onClick}
          disabled={disabled}
          icon={icon}
          htmlType={htmlType}
          className={className}
        >
          {children}
        </AntButton>
      </span>
    );
  }
}

export default Button;
