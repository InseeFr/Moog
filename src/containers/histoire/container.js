import { connect } from 'react-redux';
import Histoire from 'components/consultation/histoire';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
});

export default connect(mapStateToProps)(Histoire);
