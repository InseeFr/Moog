import { connect } from 'react-redux';
import Auth from 'components/auth';
import { saveKeycloakToken, saveNoAuthLogin, refreshKeycloakToken } from 'actions/keycloak';
import { saveUrlBackEnd, saveUrlSiteMirroir, saveUrlColemanPromotion } from 'actions/url';

const mapDispatchToProps = dispatch => ({
  saveNoAuthLogin : () => dispatch(saveNoAuthLogin()),
  saveKeycloakToken: token => dispatch(saveKeycloakToken(token)),
  refreshKeycloakToken: token => dispatch(refreshKeycloakToken(token)),
  saveUrlBackEnd: url => dispatch(saveUrlBackEnd(url)),
  saveUrlSiteMirroir: url => dispatch(saveUrlSiteMirroir(url)),
  saveUrlColemanPromotion: url => dispatch(saveUrlColemanPromotion(url)),
});

export default connect(
  undefined,
  mapDispatchToProps
)(Auth);
