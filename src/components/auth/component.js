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
          setAuthType(data.authType);
          setIdentityProvider(data.identityProvider);
        });
    }
    if (authType === KEYCLOAK && identityProvider) {
      const keycloakTemp = new Keycloak(confKeycloak);
      const kcLogin = keycloakTemp.login;
      keycloakTemp.login = (options) => {
        const options2 = options;
        options2.idpHint = identityProvider;
        kcLogin(options2);
      };
      keycloakTemp.redirectUri = window.location.href.replace(
        window.location.search,
        ""
      );
      setKc(keycloakTemp);
    }
  }, [authType, identityProvider]);

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

  const loginNoAuth = () => {
    saveNoAuthLogin();
  };

  useEffect(() => {
    if (authType === KEYCLOAK && !!kc) {
      kc.init({ onLoad: "login-required" })
        .then(() => {
          setToken(kc.token);
          saveKeycloakToken(kc);
          setInterval(() => refreshToken(), 10000);
        })
        .catch(() => setError(true));
    } else if (authType === NO_AUTH) {
      loginNoAuth();
    }
  }, [kc, authType]);

  return (
    <>
      {!error && (!authType || (authType === KEYCLOAK && !token)) && (
        <div>Loading ...</div>
      )}
      {!error && authType === KEYCLOAK && token && <AppContainer />}
      {!error && authType === NO_AUTH && <AppContainer />}
      {error && <div>Erreur inconnue - probléme authentification !</div>}
    </>
  );
};

export default Auth;
