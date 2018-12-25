import * as React from "react";
import MenuCategory from "../MenuCategory";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  className?: string;
  category: string;
  onChangeCategory: (category: string) => void;
}

class Menu extends React.Component<IProps> {
  render() {
    const { className, category, onChangeCategory } = this.props;

    return (
      <div className={cx("panel", className)}>
        <MenuCategory
          onClick={onChangeCategory}
          open={category}
          name="Группы"
          url="group"
        />
        <MenuCategory
          onClick={onChangeCategory}
          open={category}
          name="Аудитории"
          url="auditory"
        />
        <MenuCategory
          onClick={onChangeCategory}
          open={category}
          name="Преродаватели"
          url="teacher"
        />
        <MenuCategory
          onClick={onChangeCategory}
          open={category}
          name="Мероприятия"
          url="event"
        />
        <MenuCategory
          onClick={onChangeCategory}
          open={category}
          name="Онлайн"
          url="online"
        />
      </div>
    );
  }
}

export default Menu;
