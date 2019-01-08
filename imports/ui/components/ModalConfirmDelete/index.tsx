import * as React from "react";
import Button from "../Button";

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
      При удалении сторуться все данные, их нельзя будет восстановить
    </Modal>
  );
};

export default confirmDelete;
