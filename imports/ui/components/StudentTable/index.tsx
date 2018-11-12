import * as React from "react";
import { IStudent } from "../../../models/student";
import { Link } from "react-router-dom";
const Table = require("antd/lib/table");
require("antd/lib/button/style/css");
const { Column } = Table;

import { students } from "./data";

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  edit: (student) => void;
}

interface IState {
  currentPage: number;
}

class StudentTable extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1
    };
  }

  renderLink = (text: string, record: IStudent) => (
    <Link to={`/student-table/${record._id}`}>{text}</Link>
  );

  renderGroup = (text: string, record: IStudent) => {
    const groups = record.group.map(group => group.name).join(", ");

    return <Link to={`/student-table/${record._id}`}>{groups}</Link>;
  };

  renderEdit = (text: string, record: IStudent) => {
    const handleEdit = () => this.props.edit(record);

    return (
      <div className={cx("student-table__edit")} onClick={handleEdit}>
        ✏️
      </div>
    );
  };

  onChange = (pagination, filters, sorter) => {
    this.changePagination(pagination.current);
    console.log(filters);
    console.log(sorter);
  };

  changePagination = (page: number) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { currentPage } = this.state;
    const pagination = {
      current: currentPage,
      total: 100,
      pageSize: 10
    };

    return (
      <Table
        dataSource={students}
        onChange={this.onChange}
        pagination={pagination}
        rowKey={"_id"}
      >
        <Column
          title="Имя"
          dataIndex="firstName"
          key="firstName"
          render={this.renderLink}
          sorter={true}
        />
        <Column
          title="Фамилия"
          dataIndex="lastName"
          key="lastName"
          render={this.renderLink}
          sorter={true}
        />
        <Column
          title="Группа"
          dataIndex="group"
          key="group"
          render={this.renderGroup}
        />
        <Column title="Изменить" render={this.renderEdit} width="86px" />
      </Table>
    );
  }
}

export default StudentTable;
