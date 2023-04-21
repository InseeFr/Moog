import { connect } from "react-redux";
import Auth from "components/auth";
import {
  saveKeycloakToken,
  saveNoAuthLogin,
  refreshKeycloakToken,
} from "actions/keycloak";
import {
  saveUrlBackEnd,
  saveUrlSiteMirroir,
  saveUrlColemanPromotion,
} from "actions/url";
import {
  saveRoleAdministrateur,
  saveRoleGestionnaire,
  saveRoleAssistance,
} from "../../actions/roles";

const mapDispatchToProps = (dispatch) => ({
  saveNoAuthLogin: () => dispatch(saveNoAuthLogin()),
  saveKeycloakToken: (token) => dispatch(saveKeycloakToken(token)),
  refreshKeycloakToken: (token) => dispatch(refreshKeycloakToken(token)),
  saveUrlBackEnd: (url) => dispatch(saveUrlBackEnd(url)),
  saveUrlSiteMirroir: (url) => dispatch(saveUrlSiteMirroir(url)),
  saveUrlColemanPromotion: (url) => dispatch(saveUrlColemanPromotion(url)),
  saveRoleAdministrateur: (roles) => dispatch(saveRoleAdministrateur(roles)),
  saveRoleGestionnaire: (roles) => dispatch(saveRoleGestionnaire(roles)),
  saveRoleAssistance: (roles) => dispatch(saveRoleAssistance(roles)),
});

export default connect(undefined, mapDispatchToProps)(Auth);
