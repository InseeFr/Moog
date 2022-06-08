import { connect } from 'react-redux';
import Ue from 'components/consultation/ue';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
});

export default connect(mapStateToProps)(Ue);
