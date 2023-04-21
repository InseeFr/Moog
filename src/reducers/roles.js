import {
  ROLE_ADMINISTRATEUR,
  ROLE_ASSISTANCE,
  ROLE_GESTIONNAIRE,
} from "actions/constants/roles";

export default (state = {}, action) => {
  const { type, payload: roles } = action;
  switch (type) {
    case ROLE_ADMINISTRATEUR:
      return { ...state, roleAdministrateur: roles.split(",") };
    case ROLE_ASSISTANCE:
      return { ...state, roleAssistance: roles.split(",") };
    case ROLE_GESTIONNAIRE:
      return { ...state, roleGestionnaire: roles.split(",") };
    default:
      return state;
  }
};
