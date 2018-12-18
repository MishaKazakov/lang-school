import * as React from "react";
import Layout from "../../components/Layout";
import StudentTable from "../../components/StudentTable";
import { connect } from "react-redux";
import { openModal } from "../../reducers/modalReducer";
import ModalStudent from "../../components/ModalStudent";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IDispatchFromProps {
  openModal: (name: string, extra?: any) => void;
}

class Students extends React.Component<IDispatchFromProps> {
  editStudent = student => this.props.openModal("student", student);
  addStudent = () => this.props.openModal("student");

  render() {
    return (
      <Layout>
        <ModalStudent />
        <div className={cx("students")}>
          <div className={cx("students__add")}>
            <span onClick={this.addStudent} className={cx("link")}>
              Добавить студента
            </span>
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
