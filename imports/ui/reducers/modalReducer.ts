interface IAction {
  type: string;
  modalName: string;
  extra: any;
}

export const modalReducer = (state = {}, action: IAction) => {
  const { type, modalName, extra } = action;

  switch (type) {
    case "OPEN_MODAL": {
      return {
        ...state,
        [modalName]: true,
        extra
      };
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        [modalName]: false,
        extra: null
      };
    }
    default:
      return state;
  }
};

export const openModal = dispatch => (modalName: string, extra) =>
  dispatch({
    type: "OPEN_MODAL",
    modalName,
    extra
  });

export const closeModal = dispatch => (modalName: string) =>
  dispatch({
    type: "CLOSE_MODAL",
    modalName
  });
