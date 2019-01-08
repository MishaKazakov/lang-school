import * as React from "react";
import ModalTeacher from "../ModalTeacher";
import ModalAuditory from "../ModalAuditory";
import ModalEvent from "../ModalEvent";
import ModalActivity from "../ModalActivity";
import ModalGroup from "../ModalGroup";
import ModalActivityEvent from "../ModalActivityEvent";

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
