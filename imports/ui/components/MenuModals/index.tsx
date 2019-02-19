import * as React from "react";
import ModalTeacher from "../../modals/ModalTeacher";
import ModalAuditory from "../../modals/ModalAuditory";
import ModalEvent from "../../modals/ModalEvent";
import ModalActivity from "../../modals/ModalActivity";
import ModalGroup from "../../modals/ModalGroup";
import ModalActivityEvent from "../../modals/ModalActivityEvent";

export default function() {
  return (
    <>
      <ModalTeacher />
      <ModalAuditory />
      <ModalEvent />
      <ModalActivity />
      <ModalActivityEvent />
      <ModalGroup />
    </>
  );
}
