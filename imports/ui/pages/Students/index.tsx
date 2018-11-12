import * as React from "react";
import Layout from "../../components/Layout";
import StudentTable from "../../components/StudentTable";

const cx = require("classnames/bind").bind(require("./style.scss"));

class Students extends React.Component {
  edit = student => console.log(student);

  addStudent = () => console.log("add student");

  render() {
    return (
      <Layout>
        <div className={cx("students")}>
          <div className={cx("students__add")}>
            <span onClick={this.addStudent} className={cx("pseudo-link")}>
              Добавить студента
            </span>
          </div>
          <StudentTable edit={this.edit} />
        </div>
      </Layout>
    );
  }
}

export default Students;
