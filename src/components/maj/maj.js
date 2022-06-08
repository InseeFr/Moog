import Papa from 'papaparse';
import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import myAxios from 'utils/api-call';
import Loader from 'utils/loader';
import MapObjects from '../utils/jsonUtils';
import '../../index.css';
import {
  idContact,
  idUe,
  libellesAutorises,
  longueurIdContact,
  longueurMinIdUe,
  nbChamps,
  pathEnregistrerInfoSuiviGestion,
  pathTransmissionCampagne,
  reponseAttenduDansCSV,
  statut,
} from '../../utils/properties';
import Bilan from './bilan';

export default class Maj extends Component {
  static csvJSON(csv) {
    let newCsv = csv;
    newCsv = newCsv.replace('idue', 'idUe');
    newCsv = newCsv.replace('idcontact', 'idContact');
    return Papa.parse(newCsv, { header: true, skipEmptyLines: true });
  }

  static validFileContent(data) {
    const dataJson = Maj.csvJSON(data);

    const erreurEnteteColonnes =
      dataJson.meta.fields.filter(element => !libellesAutorises.includes(element)).length > 0;

    const erreurNombreChamps = !nbChamps.includes(dataJson.meta.fields.length);
    // verif nb de colonnes + nom des colonnes
    if (erreurNombreChamps || erreurEnteteColonnes) return false;

    // verif statuts autorisés + longueur de l'identifiant (idContact -> longueurIdContact / idue --> non vide donc longeur >=1)
    if (dataJson.meta.fields.includes(idContact) && !dataJson.meta.fields.includes(idUe)) {
      return (
        dataJson.data.filter(
          item =>
            item[idContact].length !== longueurIdContact || !(item[statut] in reponseAttenduDansCSV)
        ).length === 0
      );
    }
    if (dataJson.meta.fields.includes(idUe) && !dataJson.meta.fields.includes(idContact)) {
      return (
        dataJson.data.filter(
          item => item[idUe].length < longueurMinIdUe || !(item[statut] in reponseAttenduDansCSV)
        ).length === 0
      );
    }
    return false;
  }

  constructor(props) {
    super(props);
    let reader;
    this.state = {
      isVerifOk: false,
      isMauvaisFormatAffiche: false,
      displayBilan: false,
      file: null,
      jsonContent: null,
      dataBilan: { ok: null, listError: [] },
      isLoading: false,
      openModalValidation: false,
      displayErrorMessage: false,
    };

    this.handleFileRead = () => {
      const content = reader.result;
      this.setState({ file: content });

      if (Maj.validFileContent(this.state.file)) {
        this.setState({ isVerifOk: true, jsonContent: Maj.csvJSON(this.state.file).data });
      } else {
        this.setState({
          file: null,
          isVerifOk: false,
          jsonContent: null,
          isMauvaisFormatAffiche: true,
        });
      }
    };

    this.handleChange = file => {
      this.setState({ displayBilan: false, displayErrorMessage: false });
      reader = new FileReader();
      reader.onloadend = this.handleFileRead;
      reader.readAsText(file);
    };

    this.onClick = () => {
      const { id } = this.props;
      const { jsonContent } = this.state;
      this.setState({ isLoading: true });
      console.log(jsonContent);
      myAxios()
        .post(pathTransmissionCampagne + id + pathEnregistrerInfoSuiviGestion, {
          data: MapObjects(jsonContent,'uploadEN'),
        })
        .then(response => {
          this.setState({
            isLoading: false,
            dataBilan: { ok: response.data.OK.length, listError: response.data.KO },
            displayBilan: true,
          });
        })
        .catch(() => {
          this.setState({
            isLoading: false,
            displayErrorMessage: true,
          });
        });
      this.setState({
        file: null,
        isVerifOk: false,
        jsonContent: null,
        isMauvaisFormatAffiche: false,
        displayBilan: false,
        openModalValidation: false,
      });
    };
  }

  onOpenModalValidation() {
    this.setState({
      openModalValidation: true,
    });
  }

  onCloseModalValidation() {
    this.setState({ openModalValidation: false });
  }

  validDate() {
    const { dateDebut, dateFin } = this.props;
    const now = new Date().getTime();
    if (now < dateDebut) return 'NOT_STARTED';
    if (dateFin < now) return 'FINISHED';
    return 'OPEN';
  }

  render() {
    const {
      isVerifOk,
      isMauvaisFormatAffiche,
      displayBilan,
      isLoading,
      openModalValidation,
      displayErrorMessage,
      dataBilan,
    } = this.state;
    const { label } = this.props;
    return (
      <div className="container">
        {this.validDate() === 'OPEN' && (
          <input
            type="file"
            id="file"
            className="form-control-file"
            accept=".csv"
            onInput={e => this.handleChange(e.target.files[0])}
            onClick={event => {
              event.target.value = null;
            }}
          />
        )}
        {this.validDate() === 'NOT_STARTED' && (
          <div>
            <h2 style={{ color: 'red' }}>
              L'enquête n'a pas démarré. Il est impossible d'enregistrer des évènements.
            </h2>
          </div>
        )}
        {this.validDate() === 'FINISHED' && (
          <div>
            <h2 style={{ color: 'red' }}>
              L'enquête est terminée. Il est impossible d'enregistrer des évènements.
            </h2>
          </div>
        )}
        {isVerifOk && (
          <div>
            <h2 style={{ color: 'green' }}>Format de fichier correct</h2>
            <button type="button" onClick={() => this.onOpenModalValidation()}>
              Enregistrer
            </button>
          </div>
        )}
        {!isVerifOk && isMauvaisFormatAffiche && (
          <div>
            <h2 style={{ color: 'red' }}>Mauvais format de fichier</h2>
          </div>
        )}
        {isLoading && <Loader text="L'envoi des données est en cours." />}
        {displayErrorMessage && (
          <h2 style={{ color: 'red' }}>Erreur lors de l'envoi des données</h2>
        )}
        {displayBilan && <Bilan data={dataBilan} />}
        <Modal
          open={openModalValidation}
          onClose={() => this.onCloseModalValidation()}
          closeIconSize={0}
          center
        >
          <h1>{`Êtes-vous sûr d'envoyer ce fichier pour l'enquête : ${label} ?`}</h1>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => this.onClick()}
          >
            Oui
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => this.onCloseModalValidation()}
          >
            Non
          </button>
        </Modal>
      </div>
    );
  }
}
