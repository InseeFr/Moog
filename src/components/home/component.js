import button1 from 'img/button1.jpg';
import button2 from 'img/button2.jpg';
import button3 from 'img/button3.jpg';
import button4 from 'img/button4.jpg';
import button5 from 'img/button5.jpg';
import logo from 'img/logo.jpg';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import myAxios from 'utils/api-call';
import estGestionnaire from 'utils/roles';
import { pathFinalCampagne } from '../../utils/properties';
import VersionComponent from '../version/version';
import Campagne from './campagne';
import MapObjects from '../utils/jsonUtils';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idCampagneSelectionnee: '',
      labelCampagneSelectionnee: '',
      campagnesTrouvees: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;
    if (match.params !== undefined) {
      const idCampagneSelectionnee = match.params.id;

      myAxios()
        .get(pathFinalCampagne)
        .then(res => {
          const campagnesTrouvees = MapObjects(res.data.datas, 'campaign');
          campagnesTrouvees.sort(this.triage);
          this.setState({ campagnesTrouvees: campagnesTrouvees });
          if (idCampagneSelectionnee !== 'admin') {
            for (let i = 0; i < campagnesTrouvees.length; i++) {
              if (campagnesTrouvees[i].idCampagne.localeCompare(idCampagneSelectionnee) === 0) {
                this.setState({
                  idCampagneSelectionnee: idCampagneSelectionnee,
                  labelCampagneSelectionnee: campagnesTrouvees[i].labelCampagne,
                });
                this.props.campagneEnCours(
                  idCampagneSelectionnee,
                  campagnesTrouvees[i].labelCampagne,
                  campagnesTrouvees[i].dateDebutCollecte,
                  campagnesTrouvees[i].dateFinCollecte
                );
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ isLoading: false });
        });
    }
  }

  triage(option1, option2) {
    if (option1.labelCampagne < option2.labelCampagne) return -1;
    if (option1.labelCampagne > option2.labelCampagne) return 1;
    return 0;
  }

  handleChange(event) {
    var lienFutur = event.target.value;
    this.props.campagneEnCours(lienFutur, '');
    this.setState({ idCampagneSelectionnee: lienFutur });

    const lienActuel = window.location.pathname;
    var count = 0;
    var pos = lienActuel.indexOf('/');
    while (pos !== -1) {
      count = count + 1;
      pos = lienActuel.indexOf('/', pos + 1);
    }
    if (count === 2) {
      lienFutur = lienFutur + lienActuel.substring(lienActuel.lastIndexOf('/'), lienActuel.length);
    }
    window.location.pathname = lienFutur;
  }

  estConsultation() {
    const lienActuel = window.location.pathname;
    var count = 0;
    var pos = lienActuel.indexOf('/');
    while (pos !== -1) {
      count = count + 1;
      pos = lienActuel.indexOf('/', pos + 1);
    }
    return count === 1;
  }

  estCampagneChoisie() {
    return this.state.idCampagneSelectionnee !== '';
  }

  render() {
    const { idCampagneSelectionnee, campagnesTrouvees, labelCampagneSelectionnee } = this.state;
    const { roles } = this.props;
    const isGestionnaire = estGestionnaire(roles);
    return (
      <>
        <nav className="navbar navbar-inverse navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">
                <img src={logo} style={{ height: '60px', widdth: '60px' }} alt={'button'} />
                <VersionComponent />
              </a>
            </div>
            <ul className="nav navbar-nav">
              <li>
                <Link to={`/${idCampagneSelectionnee}`}>
                  <img src={button1} style={{ height: '50px', widdth: '50px' }} alt={'button'} />
                  Rechercher des enquêtés
                </Link>
              </li>
              {isGestionnaire && this.estCampagneChoisie() && (
                <>
                  <li>
                    <Link to={`/${idCampagneSelectionnee}/maj`}>
                      <img
                        src={button2}
                        style={{ height: '50px', widdth: '50px' }}
                        alt={'button'}
                      />
                      Enregistrer des évènements
                    </Link>
                  </li>
                </>
              )}
              {this.estCampagneChoisie() && (
                <li>
                  <Link to={`/${idCampagneSelectionnee}/avancement`}>
                    <img src={button3} style={{ height: '50px', widdth: '50px' }} alt={'button'} />
                    Suivre la collecte
                  </Link>
                </li>
              )}
              {isGestionnaire && this.estCampagneChoisie() && (
                <>
                  <li>
                    <Link to={`/${idCampagneSelectionnee}/relance`}>
                      <img
                        src={button4}
                        style={{ height: '50px', widdth: '50px' }}
                        alt={'button'}
                      />
                      Relancer des enquêtés
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${idCampagneSelectionnee}/historique`}>
                      <img
                        src={button5}
                        style={{ height: '50px', widdth: '50px' }}
                        alt={'button'}
                      />
                      Consulter les archives
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <form className="navbar-form pull-right">
              <select
                value={idCampagneSelectionnee}
                onChange={this.handleChange}
                className="form-control"
                style={{ width: '500px' }}
              >
                <option disabled value="">
                  Choisir une enquête
                </option>
                {campagnesTrouvees.map(({ idCampagne, labelCampagne }) => (
                  <Campagne
                    idCampagne={idCampagne}
                    labelCampagne={labelCampagne}
                    key={idCampagne}
                  />
                ))}
              </select>
            </form>
          </div>
        </nav>

        {isGestionnaire && this.estCampagneChoisie() && !this.estConsultation() && (
          <div className="container">
            <h2 style={{ color: 'red' }}>
              {`L'enquête sélectionnée est : ${labelCampagneSelectionnee}`}
            </h2>
          </div>
        )}
      </>
    );
  }
}
