export const getRolesFromKc = kc => (kc && kc.realmAccess.roles.concat(kc.tokenParsed.inseegroupedefaut)) || [];
