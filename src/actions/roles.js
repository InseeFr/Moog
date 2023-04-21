import {
  ROLE_ADMINISTRATEUR,
  ROLE_GESTIONNAIRE,
  ROLE_ASSISTANCE,
} from "./constants/roles";

export const saveRoleAdministrateur = (roles) => ({
  type: ROLE_ADMINISTRATEUR,
  payload: roles,
});
export const saveRoleGestionnaire = (roles) => ({
  type: ROLE_GESTIONNAIRE,
  payload: roles,
});
export const saveRoleAssistance = (roles) => ({
  type: ROLE_ASSISTANCE,
  payload: roles,
});
