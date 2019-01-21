import * as React from "react";
import Button from "../Button";
import { Meteor } from "meteor/meteor";
import { withRouter, match} from "react-router";
import { Location, History } from "history";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  location: Location;
  history: History;
  match: match<{ id: string }>;
}

class LogOut extends React.Component<IProps> {
  onSubmit = e => {
    e.preventDefault();
    Meteor.logout(this.onLogout);
  };

  onLogout = () => {
    this.props.history.push("/login");
  }

  render() {
    return (
      
        <Button
          type={Button.TYPE.PRIMARY}
          onClick={this.onSubmit}
        >
          Выйти
        </Button>
    );
  }
}

export default withRouter<IProps>(LogOut);
