import * as React from "react";
import Button from "../../components/Button";

const Modal = require("antd/lib/modal");

const confirmDelete = ({ onConfirmClick, onCancelClick, visible }) => {
  return (
    <Modal
      visible={visible}
      title="Подтверждение удаления"
      onCancel={onCancelClick}
      footer={[
        <Button key="cancel" onClick={onCancelClick}>
          Отменить
        </Button>,
        <Button
          key="confirm"
          type={Button.TYPE.DANGER}
          onClick={onConfirmClick}
        >
          Удалить
        </Button>
      ]}
    >
      При удалении сотруться все данные, их нельзя будет восстановить
    </Modal>
  );
};

export default confirmDelete;
