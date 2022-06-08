import { connect } from 'react-redux';
import App from 'components/app';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
});

export default connect(mapStateToProps)(App);
