import { combineReducers } from 'redux';
import keycloak from './keycloak';
import urls from './urls';

export default combineReducers({ keycloak, urls });
