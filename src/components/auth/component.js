/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import AppContainer from "containers/app";
import Keycloak from "keycloak-js";

const KEYCLOAK = "keycloak";
const NO_AUTH = "anonymous";
const confKeycloak = `${window.location.origin}/keycloak.json`;
const apiConfigPath = `${window.location.origin}/configuration.json`;

const Auth = ({
  saveKeycloakToken,
  saveNoAuthLogin,
  refreshKeycloakToken,
  saveUrlColemanPromotion,
  saveUrlBackEnd,
  saveUrlSiteMirroir,
  saveRoleAdministrateur,
  saveRoleGestionnaire,
  saveRoleAssistance,
}) => {
  const [authType, setAuthType] = useState(null);
  const [token, setToken] = useState(null);
  const [kc, setKc] = useState(null);
  const [error, setError] = useState(null);
  const [identityProvider, setIdentityProvider] = useState(null);

  useEffect(() => {
    if (!authType) {
      fetch(apiConfigPath)
        .then((response) => response.json())
        .then((data) => {
          saveUrlBackEnd(data.urlBackEnd);
          saveUrlSiteMirroir(data.urlSiteMirroir);
          saveUrlColemanPromotion(data.urlColemanPromotion);
          saveRoleAdministrateur(data.roleAdministrateur);
          saveRoleGestionnaire(data.roleGestionnaire);
          saveRoleAssistance(data.roleAssistance);
          setAuthType(data.authType);
          setIdentityProvider(data.identityProvider);
        });
    }
    if (authType === KEYCLOAK && identityProvider) {
      const keycloakTemp = new Keycloak(confKeycloak);
      const kcLogin = keycloakTemp.login;
      keycloakTemp.login = (options = {}) =>
        kcLogin({ ...options, idpHint: identityProvider });
      setKc(keycloakTemp);
    }
  }, [
    authType,
    identityProvider,
    saveRoleAdministrateur,
    saveRoleAssistance,
    saveRoleGestionnaire,
    saveUrlBackEnd,
    saveUrlColemanPromotion,
    saveUrlSiteMirroir,
  ]);

  useEffect(() => {
    const loginNoAuth = () => {
      saveNoAuthLogin();
    };

    const refreshToken = () => {
      kc.updateToken(30)
        .then((isUpdated) => {
          if (isUpdated) {
            setToken(kc.token);
            refreshKeycloakToken(kc);
          }
        })
        .catch(() => {
          window.location.href = window.location;
        });
    };

    if (authType === KEYCLOAK && !!kc) {
      kc.init({ onLoad: "login-required", checkLoginIframe: false })
        .then(() => {
          setToken(kc.token);
          saveKeycloakToken(kc);
          setInterval(() => refreshToken(), 10000);
        })
        .catch(() => setError(true));
    } else if (authType === NO_AUTH) {
      loginNoAuth();
    }
  }, [kc, authType, saveKeycloakToken, saveNoAuthLogin, refreshKeycloakToken]);

  return (
    <>
      {!error && (!authType || (authType === KEYCLOAK && !token)) && (
        <div>Loading ...</div>
      )}
      {!error && authType === KEYCLOAK && token && <AppContainer />}
      {!error && authType === NO_AUTH && <AppContainer />}
      {error && <div>Erreur inconnue - problème d'authentification !</div>}
    </>
  );
};

export default Auth;
