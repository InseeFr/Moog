import { connect } from 'react-redux';
import Admin from 'components/admin/admin';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
});

export default connect(mapStateToProps)(Admin);
