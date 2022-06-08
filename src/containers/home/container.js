import { connect } from 'react-redux';
import Home from 'components/home';

const mapStateToProps = state => ({
  roles: state.keycloak.roles,
});

export default connect(mapStateToProps)(Home);
