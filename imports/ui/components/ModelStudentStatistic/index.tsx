import * as React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { IStudent, IStudentGroup } from "../../../models/student";
import { IGroup } from "../../../models/group";
import Button from "../Button";
import { Students } from "../../../api/students";
import { Groups } from "../../../api/groups";

const Modal = require("antd/lib/modal");

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
  id: string;
  visible: boolean;
  onClose: () => void;
  student?: IStudent;
  groups?: IGroup[];
}

class ModelStudentStatistic extends React.Component<IProps> {
  render() {
    const { visible, student, groups } = this.props;
    const title =
      student && `Статистика ${student.firstName} ${student.lastName}`;
    const statistic = student && this.getStatistic(student, groups);

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.onClose}
        footer={[
          <Button key="cancel" onClick={this.onClose}>
            Закрыть
          </Button>
        ]}
      >
        {statistic}
      </Modal>
    );
  }

  onClose = () => this.props.onClose && this.props.onClose();

  getStatistic = (student: IStudent, groups: IGroup[]) => {
    const statistic = [];

    for (const groupId in student.group) {
      const group = groups.find(group => group._id === groupId);
      const groupData = this.getGroupsData(student.group[groupId], group.name);
      statistic.push(groupData);
    }

    return statistic;
  };

  getGroupsData = (groupData: IStudentGroup, name: string) => {
    const { _id, numberLessons, attended, miss, canceled } = groupData;
    const balance = numberLessons - attended.length - miss.length;

    return (
      <div key={_id} className={cx("group-data")}>
        <div className={cx("group-data__title")}>{`Группа ${name}`}</div>
        <div className={cx("group-data__field")}>
          Оплачено:
          <span className={cx("group-data__value")}>{numberLessons}</span>
        </div>
        <div className={cx("group-data__field")}>
          Посещено:
          <span className={cx("group-data__value")}>{attended.length}</span>
        </div>
        <div className={cx("group-data__field")}>
          Пропушено:
          <span className={cx("group-data__value")}>{miss.length}</span>
        </div>
        <div className={cx("group-data__field")}>
          Отменено:
          <span className={cx("group-data__value")}>{canceled.length}</span>
        </div>
        <div className={cx("group-data__field")}>
          Осталось:
          <span className={cx("group-data__value")}>{balance}</span>
        </div>
      </div>
    );
  };
}

export default withTracker<any, IProps>(({ id: _id }) => {
  const student: IStudent = Students.findOne({ _id }) as IStudent;
  const studentGroupIds = [];
  if (student) {
    for (const groupId in student.group) {
      studentGroupIds.push(groupId);
    }
  }

  return {
    student,
    groups: Groups.find({
      _id: { $in: studentGroupIds }
    }).fetch()
  };
})(ModelStudentStatistic);
