import { combineReducers } from "redux";
import keycloak from "./keycloak";
import urls from "./urls";
import roles from "./roles";

export default combineReducers({ keycloak, urls, roles });
