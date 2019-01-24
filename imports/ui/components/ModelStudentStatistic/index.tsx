import * as React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { IStudent, IStudentGroup, IStatus } from "../../../models/student";
import { IGroup } from "../../../models/group";
import Button from "../Button";
import { Students } from "../../../api/students";
import { Groups } from "../../../api/groups";
import { dateString } from "../../../helpers/time";

const Modal = require("antd/lib/modal");
const Menu = require("antd/lib/menu");
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;

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
      const groupData = student.group[groupId];
      const groupElements = this.groupElements(groupData, group.name);

      statistic.push(groupElements);
    }

    student.archiveGroups &&
      student.archiveGroups.forEach(groupData => {
        const group = groups.find(group => group._id === groupData._id);
        const groupElements = this.groupElements(groupData, group.name);

        statistic.push(groupElements);
      });

    return statistic;
  };

  groupElements = (groupData: IStudentGroup, name: string) => {
    const {
      _id,
      numberLessons,
      attended,
      miss,
      canceled,
      purchaseDate
    } = groupData;
    const balance = numberLessons - attended.length - miss.length;

    return (
      <div key={_id} className={cx("group-data")}>
        <div className={cx("group-data__title")}>{`Группа ${name}`}</div>
        <Menu mode="inline">
          <Menu.Item key="numberLessons">
            <span>
              Оплачено:
              <span className={cx("group-data__value")}>
                занятий {numberLessons}.
              </span>
              <span className={cx("group-data__value")}>
                Дата: {dateString(purchaseDate)}
              </span>
            </span>
          </Menu.Item>
          {this.getStatisticGroup("Посещено", attended)}
          {this.getStatisticGroup("Пропущено", miss)}
          {this.getStatisticGroup("Отменено", canceled)}
          <Menu.Item key="balance">
            <div>
              Осталось:
              <span className={cx("group-data__value")}>
                занятий {balance}.
              </span>
            </div>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  getStatisticGroup = (title, Statuses: IStatus[]) => {
    return (
      <SubMenu
        key={title}
        title={
          <span>
            Отменено:
            <span className={cx("group-data__value")}>
              занятий {Statuses.length}.
            </span>
          </span>
        }
      >
        <MenuItemGroup title="Даты занятий:">
          {Statuses.map((stat: IStatus, i) => (
            <Menu.Item key={stat.id} className={cx("statistic__date")}>{dateString(stat.date)}</Menu.Item>
          ))}
        </MenuItemGroup>
      </SubMenu>
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
    student.archiveGroups &&
      student.archiveGroups.forEach(group => {
        studentGroupIds.push(group._id);
      });
  }

  return {
    student,
    groups: Groups.find({
      _id: { $in: studentGroupIds }
    }).fetch()
  };
})(ModelStudentStatistic);
