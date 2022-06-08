import { connect } from 'react-redux';
import Main from 'components/main/main';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
});

export default connect(mapStateToProps)(Main);
