import * as React from "react";
import ModalTeacher from "../ModalTeacher";
import ModalAuditory from "../ModalAuditory";
import ModalEvent from "../ModalEvent";
import ModalActivity from "../ModalActivity"

export default function() {
  return (
    <>
      <ModalTeacher />
      <ModalAuditory />
      <ModalEvent />
      <ModalActivity />
    </>
  );
}
