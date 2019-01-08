import * as React from "react";
import MenuCategory from "../MenuCategory";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  className?: string;
  category: string;
  categories: { name: string; url: string }[];
  onChangeCategory: (categoryName: string, categoryTitle: string) => void;
}

class Menu extends React.Component<IProps> {
  onChangeCategory = (categoryName, categoryTitle) =>
    this.props.onChangeCategory &&
    this.props.onChangeCategory(categoryName, categoryTitle);

  render() {
    const { className, category, onChangeCategory, categories } = this.props;

    return (
      <div className={cx("panel", className)}>
        {categories.map(item => (
          <MenuCategory
            key={item.name}
            onClick={onChangeCategory}
            open={category}
            name={item.name}
            url={item.url}
          />
        ))}
      </div>
    );
  }
}

export default Menu;
