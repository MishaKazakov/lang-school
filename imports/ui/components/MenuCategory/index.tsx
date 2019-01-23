import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../Button";
import MenuItem from "../MenuItem";
import { openModal } from "../../reducers/modalReducer";

import { Activities } from "../../../api/activities";
import { Auditories } from "../../../api/auditories";
import { Teachers } from "../../../api/teachers";
import { Groups } from "../../../api/groups";

import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

const cx = require("classnames/bind").bind(require("./style.scss"));

const propsItems = [
  {
    _id: "1",
    name: "Английский"
  },
  { _id: "2", name: "Немецкий" },
  { _id: "3", name: "Французкий" }
];

interface IDispatchFromProps {
  openModal: (name: string, extra?: any, group?: string) => void;
}

interface IDataProps {
  items?: any;
}

interface IProps {
  name: string;
  url: string;
  open: string;
  onClick: (categoryName: string, categoryTitle: string) => void;
  items?: any;
}

class MenuCategory extends React.Component<IProps & IDispatchFromProps> {
  onAddClick = () => this.props.openModal(this.props.url);
  onEditClick = _id => this.props.openModal(this.props.url, _id);

  isAccessable = (item:any, user)=>{
    //const user = Meteor.user() as { _id: string; profile: { role: string }; };
    return !user ||
    (!item.userId ||
      item.userId === user._id ||
      user.profile.role === "admin");
  }

  render() {
    const { name, url, open, items } = this.props;
    const address = "/" + url;
    const isOpen = open === url;
    const onClick = () => this.props.onClick(url, name);
    const user = Meteor.user() as { _id: string; profile: { role: string }; };

    return (
      <div className={cx("menu-category")}>
        <Link
          to={address}
          onClick={onClick}
          className={cx("menu-category__link", {
            "menu-category__link_selected": isOpen
          })}
        >
          {name}
        </Link>
        {isOpen && (
          <div className={cx("menu-category__list")}>
            {items.map(
              item => this.isAccessable(item, user) && (
                  <MenuItem
                    key={item._id}
                    item={item}
                    url={address}
                    onClick={this.onEditClick}
                  />
                )
            )}
            <Button
              icon={Button.ICON.ADD}
              size={Button.SIZE.SMALL}
              onlyIcon
              onClick={this.onAddClick}
            />
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  connect<null, IDispatchFromProps, IProps>(
    null,
    dispatch => ({
      openModal: openModal(dispatch)
    })
  ),
  withTracker<IDataProps, IProps>(({ url }) => {
    switch (url) {
      case "auditory":
        return {
          items: Auditories.find().fetch()
        };
      case "teacher":
        return {
          items: Teachers.find().fetch()
        };
      case "group":
        return {
          items: Groups.find().fetch()
        };
      case "activity": {
        return {
          items: Activities.find().fetch()
        };
      }
      default:
        return {
          items: propsItems
        };
    }
  })
)(MenuCategory);
