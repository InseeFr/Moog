import { GESTIONNAIRE_ROLE, ASSISTANCE_ROLE } from './properties';

export default function estGestionnaire(roles) {
  const test = Array.isArray(roles) && roles.includes(GESTIONNAIRE_ROLE);
  return test;
}

export function estAssistance(roles) {
  const test = Array.isArray(roles) && roles.includes(ASSISTANCE_ROLE);
  return test;
}
