import Papa from 'papaparse';
import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import myAxios from 'utils/api-call';
import Loader from 'utils/loader';
import '../../index.css';
import { pathListRelance, pathTransmissionCampagne } from '../../utils/properties';
import MapObjects from '../utils/jsonUtils';

export default class Relance extends Component {
  static ajoutColonneRelance(donnee) {
    const donneesTraitees = donnee
      .map(element => {
        const simpleElement = {
          idue: element.idUe,
          numeroDeLot: element.numeroDeLot,
          statut: 'RELANCE',
          pnd: element.pnd,
        };
        return simpleElement;
      })
      .sort((a, b) => ` ${a.idue}`.localeCompare(b.idue))
      .sort((a, b) => a.numeroDeLot - b.numeroDeLot);

    return Papa.unparse(donneesTraitees);
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  componentWillMount() {
    const { id } = this.props;
    myAxios()
      .get(pathTransmissionCampagne + id + pathListRelance)
      .then(res => {
        const tableauModifRaw = MapObjects(res.data.datas, 'surveyUnit');
        const tableauModif = Relance.ajoutColonneRelance(tableauModifRaw);
        this.setState({ data: tableauModif, isLoading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  }

  validDate() {
    const { dateDebut, dateFin } = this.props;
    const now = new Date().getTime();
    if (now < dateDebut) return 'NOT_STARTED';
    if (dateFin < now) return 'FINISHED';
    return 'OPEN';
  }

  render() {
    const { id } = this.props;
    const { data, isLoading } = this.state;
    const date = new Date();
    return (
      <div className="container">
        {this.validDate() === 'FINISHED' && (
          <div>
            <h2 style={{ color: 'red' }}>
              L'enquête est terminée. Il est impossible d'extraire les données de relance.
            </h2>
          </div>
        )}
        {this.validDate() === 'NOT_STARTED' && (
          <div>
            <h2 style={{ color: 'red' }}>
              L'enquête n'a pas commencé. Il est impossible d'extraire les données de relance.
            </h2>
          </div>
        )}
        {!isLoading && this.validDate() === 'OPEN' && (
          <CSVLink target="_parent" data={data} filename={`${id}_${date.toLocaleDateString()}.csv`}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ backgroundColor: 'grey' }}
            >
              Extraire les données de relance
            </button>
          </CSVLink>
        )}
        {isLoading && this.validDate() && <Loader text="Le chargement des données est en cours." />}
      </div>
    );
  }
}
