import * as React from "react";
import Layout from "../../components/Layout";
import StudentTable from "../../components/StudentTable";
import { connect } from "react-redux";
import { openModal } from "../../reducers/modalReducer";
import ModalStudent from "../../modals/ModalStudent";
import Button from "../../components/Button";
const cx = require("classnames/bind").bind(require("./style.scss"));

interface IDispatchFromProps {
  openModal: (name: string, extra?: any) => void;
}

interface IState {
  search: string;
}

class Students extends React.Component<IDispatchFromProps, IState> {
  constructor(props) {
    super(props);

    this.state = { search: "" };
  }

  editStudent = student => this.props.openModal("student", student);
  addStudent = () => this.props.openModal("student");

  render() {
    return (
      <Layout>
        <ModalStudent />
        <div className={cx("students")}>
          <div className={cx("students__panel")}>
            <Button onClick={this.addStudent} type={Button.TYPE.PRIMARY}>
              Добавить студента
            </Button>
          </div>
          <StudentTable edit={this.editStudent} />
        </div>
      </Layout>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    openModal: openModal(dispatch)
  })
)(Students);
