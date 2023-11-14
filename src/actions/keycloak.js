import {
  SAVE_KEYCLOAK_TOKEN,
  REFRESH_KEYCLOAK_TOKEN,
  SAVE_NO_AUTH_LOGIN,
} from "./constants/keycloak";

export const saveKeycloakToken = (kc) => ({
  type: SAVE_KEYCLOAK_TOKEN,
  payload: kc,
});
export const saveNoAuthLogin = () => ({
  type: SAVE_NO_AUTH_LOGIN,
  payload: null,
});
export const refreshKeycloakToken = (kc) => ({
  type: REFRESH_KEYCLOAK_TOKEN,
  payload: kc,
});
