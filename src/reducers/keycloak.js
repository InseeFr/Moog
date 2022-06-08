import {
  SAVE_KEYCLOAK_TOKEN,
  REFRESH_KEYCLOAK_TOKEN,
  SAVE_NO_AUTH_LOGIN,
} from 'actions/constants/keycloak';
import { getRolesFromKc } from 'utils/keycloak/token';
import { GESTIONNAIRE_ROLE } from 'utils/properties';

export default (state = {}, action) => {
  const { type, payload: kc } = action;
  switch (type) {
    case SAVE_NO_AUTH_LOGIN:
      return { ...state, roles: [GESTIONNAIRE_ROLE] };
    case SAVE_KEYCLOAK_TOKEN:
      return { ...state, kc, roles: getRolesFromKc(kc) };
    case REFRESH_KEYCLOAK_TOKEN:
      return { ...state, kc };
    default:
      return state;
  }
};
