import { connect } from 'react-redux';
import Consultation from 'components/consultation/consultation';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
  linkQuestionnaire: state.urls.linkQuestionnaire,
  urlColemanPromotion: state.urls.urlColemanPromotion,
});

export default connect(mapStateToProps)(Consultation);
