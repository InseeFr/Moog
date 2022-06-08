import * as Keycloak from 'keycloak-js';

const confKeycloak = `${window.location.origin}/keycloak.json`;

export const kc = Keycloak(confKeycloak);

export default kc;
