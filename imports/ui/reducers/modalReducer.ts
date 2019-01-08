interface IAction {
  type: string;
  modalName: string;
  extra?: any;
  groupId?: string;
}

export const modalReducer = (state = {}, action: IAction) => {
  const { type, modalName, extra, groupId } = action;

  switch (type) {
    case "OPEN_MODAL": {
      return {
        ...state,
        [modalName]: true,
        extra,
        groupId
      };
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        [modalName]: false,
        extra: null,
        groupId: null
      };
    }
    default:
      return state;
  }
};

export const openModal = dispatch => (modalName: string, extra, groupId) =>
  dispatch({
    type: "OPEN_MODAL",
    modalName,
    extra,
    groupId
  });

export const closeModal = dispatch => (modalName: string) =>
  dispatch({
    type: "CLOSE_MODAL",
    modalName
  });
