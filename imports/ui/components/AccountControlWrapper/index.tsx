import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Redirect, withRouter, match } from "react-router";
import { Location, History } from "history";
import LogOut from "../LogOut";
import ChangePassword from "../ChangePassword";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

class AccountControlWrapper extends React.Component<IProps> {
  render() {
    if (!Meteor.userId()) return <Redirect to="/login" />;

    return (
      <div className={cx("account-container")}>
        <ChangePassword />
        <LogOut />
      </div>
    );
  }
}

export default withRouter<IProps>(AccountControlWrapper);
