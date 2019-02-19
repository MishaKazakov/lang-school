import * as React from "react";
import { IStudent } from "../../../models/student";
import { IGroup } from "../../../models/group";
import Button from "../Button";
import * as qs from "query-string";
import { Location, History } from "history";
import { withRouter, match } from "react-router";
import { compose } from "redux";
import ModalStudentStatistic from "../../modals/ModalStudentStatistic";

import { Students } from "../../../api/students";
import { Groups } from "../../../api/groups";

import { withTracker } from "meteor/react-meteor-data";

const Search = require("antd/lib/input").Search;
const Icon = require("antd/lib/icon");
const Table = require("antd/lib/table");
const { Column } = Table;

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  edit: (student) => void;
  students?: IStudent;
  total?: number;
  location?: Location;
  history?: History;
  match?: match<{ id: string }>;
  groups?: IGroup[];
}

interface IState {
  visibleStatistic: boolean;
  studentId: string;
  search: string;
}

class StudentTable extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    const query = qs.parse(props.location.search).search;
    this.state = {
      studentId: null,
      visibleStatistic: null,
      search: query || ""
    };
  }

  renderLink = (text: string, record: IStudent) => {
    const handleClick = () => this.props.edit(record._id);

    return (
      <div className={cx("link")} onClick={handleClick}>
        {text}
      </div>
    );
  };

  renderGroup = (text: string, record: IStudent) => {
    const { groups } = this.props;
    const handleClick = () => this.props.edit(record._id);
    const groupNames = [];

    for (let groupId in record.group) {
      const groupName =
        groups && groups.find(group => group._id === groupId).name;
      groupNames.push(groupName);
    }

    return (
      <div className={cx("link")} onClick={handleClick}>
        {groupNames.join(", ")}
      </div>
    );
  };

  renderStatistic = (text: string, record: IStudent) => {
    const handleClick = () => {
      this.setState({
        visibleStatistic: true,
        studentId: record._id
      });
    };

    return (
      <div className={cx("student-table__edit")}>
        <Icon
          type="line-chart"
          className={cx("student-table__icon")}
          onClick={handleClick}
        />
      </div>
    );
  };

  closeStatistic = () =>
    this.setState({ visibleStatistic: false, studentId: null });

  onSearch = value => {
    const params = {
      search: value
    };
    const newParams = qs.stringify(params);

    this.updateQuery(newParams);
  };

  onEmptySearch = () => {
    this.onSearch("");
    this.setState({ search: "" });
  };

  changeSearch = e =>
    this.setState({
      search: e.target.value
    });

  onTableChange = (pagination, filters, sorter) => {
    const params = {
      pagination: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order
    };
    const newParams = qs.stringify(params);

    this.updateQuery(newParams);
  };

  updateQuery = newParams => {
    const { history, location } = this.props;
    history.push({
      pathname: location.pathname,
      search: newParams
    });
  };

  render() {
    const { students, total, location } = this.props;
    const { visibleStatistic, studentId, search } = this.state;
    const currentPage = +qs.parse(location.search)["pagination"] || 1;
    const pagination = {
      current: currentPage,
      total: total,
      pageSize: 10
    };

    return (
      <>
        <ModalStudentStatistic
          visible={visibleStatistic}
          id={studentId}
          onClose={this.closeStatistic}
        />
        <div className={cx("student-table__panel")}>
          <Search
            placeholder="Введите имя"
            onSearch={this.onSearch}
            onChange={this.changeSearch}
            value={search}
            className={cx("student-table__search")}
          />
          <Button
            onlyIcon
            icon={Button.ICON.REMOVE}
            className={cx("student-table__empty-search")}
            onClick={this.onEmptySearch}
          />
        </div>
        <Table
          dataSource={students}
          onChange={this.onTableChange}
          pagination={pagination}
          rowKey={"_id"}
          className={cx("student-table")}
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
          <Column
            title="Статистика"
            render={this.renderStatistic}
            width="110px"
          />
        </Table>
      </>
    );
  }
}

function getParams(props) {
  const query = qs.parse(props.location.search);
  const currentPage = query["pagination"];
  const sortField = query["sortField"];
  const sortOrder = query["sortOrder"] === "ascend" ? 1 : -1;
  const searchValue = query["search"];
  const searchRegExp = new RegExp(searchValue, "i");

  const skip = currentPage > 1 ? (currentPage - 1) * 10 : 0;
  const sort = sortField ? { [sortField]: sortOrder } : { modifiedAt: -1 };
  const search = searchValue
    ? {
        $or: [{ firstName: searchRegExp }, { lastName: searchRegExp }]
      }
    : null;

  return { skip, sort, search };
}

export default compose(
  withRouter,
  withTracker<any, IProps>(props => {
    const { skip, sort, search } = getParams(props);
    const students = Students.find(
      { ...search },
      { skip, limit: 10, sort }
    ).fetch();
    const total = search ? students.length : Students.find().count();

    return {
      students,
      total,
      groups: Groups.find().fetch()
    };
  })
)(StudentTable) as React.ComponentType<IProps>;
