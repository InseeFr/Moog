import axios from "axios";
import store from "store/configure-store";

export function authHeader(config) {
  // return authorization header with auth credentials or none if anonymous

  let token = null;
  if (store.getState().keycloak && store.getState().keycloak.kc) {
    token = store.getState().keycloak.kc.token;
  }

  if (token) {
    return {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json;charset=utf-8",
    };
  }
  return {
    ...config.headers,
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/json;charset=utf-8",
  };
}

const createAxiosInstance = () => {
  const urlBack = store.getState().urls.linkBack;
  const myAxios = axios.create({
    baseURL: `${urlBack}/`,
  });

  myAxios.interceptors.request.use(async (config) =>
    Promise.resolve({
      ...config,
      headers: authHeader(config),
    })
  );
  return myAxios;
};

export default createAxiosInstance;
