import store from "store/configure-store";

export default function estGestionnaire(kcRoles) {
  console.log(kcRoles);
  console.log(store.getState().roles.roleGestionnaire);
  const test =
    Array.isArray(kcRoles) &&
    (store.getState().roles.roleGestionnaire.some((r) => kcRoles.includes(r)) ||
      store
        .getState()
        .roles.roleAdministrateur.some((r) => kcRoles.includes(r)));
  console.log(test);
  return test;
}

export function estAssistance(kcRoles) {
  const test =
    Array.isArray(kcRoles) &&
    store.getState().roles.roleAssistance.some((r) => kcRoles.includes(r));
  return test;
}
