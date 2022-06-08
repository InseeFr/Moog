import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import HomeContainer from 'containers/home';
import ConsultationContainer from 'containers/consultation';
import Maj from 'components/maj/maj';
import Avancement from 'components/avancement/avancement';
import Relance from 'components/relance/relance';
import Historique from 'components/historique/historique';
import AdminContainer from 'containers/admin';
import estGestionnaire from 'utils/roles';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idCampagneEnCours: '',
      labelCampagneEnCours: '',
      dateDebutCampagneEnCours: new Date().getTime(),
      dateFinCampagneEnCours: new Date().getTime(),
    };
    this.campagneEnCours = this.campagneEnCours.bind(this);
  }

  campagneEnCours(idCampagne, labelCampagne, dateDebutCampagneEnCours, dateFinCampagneEnCours) {
    this.setState({
      idCampagneEnCours: idCampagne,
      labelCampagneEnCours: labelCampagne,
      dateDebutCampagneEnCours: dateDebutCampagneEnCours,
      dateFinCampagneEnCours: dateFinCampagneEnCours,
    });
  }

  isCampagne() {
    return this.state.idCampagneEnCours !== '';
  }

  isUrl() {
    return this.props.match.params.id !== undefined;
  }

  isAdmin() {
    return this.props.match.params.id === 'admin';
  }

  render() {
    const { roles, match } = this.props;
    const {
      labelCampagneEnCours,
      idCampagneEnCours,
      dateDebutCampagneEnCours,
      dateFinCampagneEnCours,
    } = this.state;
    const isGestionnaire = estGestionnaire(roles);

    return (
      <>
        <HomeContainer match={match} campagneEnCours={this.campagneEnCours} />
        {this.isCampagne() && (
          <Route exact path={`${match.url}`} component={() => <ConsultationContainer />} />
        )}
        {isGestionnaire && this.isCampagne() && (
          <>
            <Route
              exact
              path={`${match.url}/maj`}
              component={routeProps => (
                <Maj
                  label={labelCampagneEnCours}
                  id={idCampagneEnCours}
                  dateDebut={dateDebutCampagneEnCours}
                  dateFin={dateFinCampagneEnCours}
                  {...routeProps}
                />
              )}
            />
          </>
        )}
        {this.isCampagne() && (
          <Route
            exact
            path={`${match.url}/avancement`}
            component={routeProps => <Avancement id={idCampagneEnCours} {...routeProps} />}
          />
        )}
        {isGestionnaire && this.isCampagne() && (
          <>
            <Route
              exact
              path={`${match.url}/relance`}
              component={routeProps => (
                <Relance
                  id={idCampagneEnCours}
                  label={labelCampagneEnCours}
                  dateDebut={dateDebutCampagneEnCours}
                  dateFin={dateFinCampagneEnCours}
                  {...routeProps}
                />
              )}
            />
            <Route
              exact
              path={`${match.url}/historique`}
              component={routeProps => <Historique id={idCampagneEnCours} {...routeProps} />}
            />
          </>
        )}
        {isGestionnaire && (
          <Route exact path="/admin" component={routeProps => <AdminContainer {...routeProps} />} />
        )}
        {!this.isCampagne() && this.isUrl() && isGestionnaire && !this.isAdmin() && (
          <h1>{`Cette enquête n'existe pas.`}</h1>
        )}
        {!this.isCampagne() && !this.isUrl() && isGestionnaire && !this.isAdmin() && (
          <Route exact path={`${match.url}`} component={() => <ConsultationContainer />} />
        )}
        {!this.isCampagne() && this.isUrl() && !isGestionnaire && (
          <h1>{`Cette enquête n'existe pas.`}</h1>
        )}
        {!this.isCampagne() && !this.isUrl() && !isGestionnaire && (
          <Route exact path={`${match.url}`} component={() => <ConsultationContainer />} />
        )}
      </>
    );
  }
}
