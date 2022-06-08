import Loader from 'components/utils/loader';
import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import myAxios from 'utils/api-call';
import { modeEnum } from 'utils/properties';
import '../../index.css';
import { pathFinalCampagne, pathTransmissionCampagne } from '../../utils/properties';
import CampagneForm from './campagneForm';
import LigneCampagne from './ligneCampagne';
import MapObjects from '../utils/jsonUtils';

export default class TableauCampagne extends Component {
  static isCampaignOpen(campaign, mode) {
    if (mode !== modeEnum.DELETE) return false;
    const { dateDebutCollecte, dateFinCollecte } = campaign;
    const currentDate = new Date().getTime();
    return dateDebutCollecte < currentDate && dateFinCollecte > currentDate;
  }

  constructor(props) {
    super(props);
    this.state = {
      donnee: [],
      showModalFormCampagne: false,
      showModalValidation: false,
      mode: modeEnum.CREATE,
      formIsValid: false,
      formErrorComment: '',
      idCampagneSelect: 'a_modifier',
      labelCampagneSelect: 'A MODIFIER',
      dateDebutCollecteSelect: new Date().getTime(),
      dateFinCollecteSelect: new Date().getTime(),
      loading: false,
    };
    this.handleFormChange = this.handleFormChange.bind(this);
    this.onOpenModalFormCampagne = this.onOpenModalFormCampagne.bind(this);
    this.onValidateModalFormCampagne = this.onValidateModalFormCampagne.bind(this);
    this.setMode = this.setMode.bind(this);
    this.selectCampagne = this.selectCampagne.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  componentDidMount() {
    const { donnee } = this.state;
    if (donnee !== undefined) {
      this.appelDonneesCampagnes();
    }
  }

  onOpenModalFormCampagne() {
    this.setState({ showModalFormCampagne: true });
  }

  onValidateModalFormCampagne() {
    this.setState({ showModalValidation: true });
  }

  onCloseModalFormCampagne() {
    this.cleanAfterCall();
  }

  onCloseModalValidation() {
    this.cleanCampagneSelect();
    this.setState({ showModalValidation: false });
  }

  onValidateModalValidation() {
    const { mode } = this.state;
    switch (mode) {
      case modeEnum.CREATE:
        this.ajouterCampagne();
        break;
      case modeEnum.DELETE:
        this.suppressionCampagne();
        break;
      case modeEnum.UPDATE:
        this.modificationCampagne();
        break;

      default:
        break;
    }
  }

  setMode(bool) {
    this.setState({ mode: bool });
  }

  setLoading(newValue) {
    this.setState({ loading: newValue });
  }

  selectCampagne(campagne) {
    this.setState(campagne);
  }

  cleanCampagneSelect() {
    this.setState({
      idCampagneSelect: 'a_modifier',
      labelCampagneSelect: 'A MODIFIER',
      dateDebutCollecteSelect: new Date().getTime(),
      dateFinCollecteSelect: new Date().getTime(),
    });
  }

  ajouterCampagne() {
    const campagneToPost = Object.assign({
      id: this.campagneSelectionne().idCampagne,
      label: this.campagneSelectionne().labelCampagne,
      collectionStartDate: this.campagneSelectionne().dateDebutCollecte,
      collectionEndDate: this.campagneSelectionne().dateFinCollecte,
    });
    myAxios()
      .post(pathFinalCampagne, MapObjects(campagneToPost, 'campagne'))
      .then(() => {
        this.cleanAfterCall();
      })
      .catch(error => {
        if (error.response.request.status === 409)
          this.setState({
            formErrorComment: `Identifiant d'enquête déjà existant`,
            showModalValidation: false,
          });
      })
      .finally(this.appelDonneesCampagnes());
  }

  modificationCampagne() {
    const { idCampagneSelect } = this.state;
    const campagneToPut = Object.assign({
      id: this.campagneSelectionne().idCampagne,
      label: this.campagneSelectionne().labelCampagne,
      collectionStartDate: this.campagneSelectionne().dateDebutCollecte,
      collectionEndDate: this.campagneSelectionne().dateFinCollecte,
    });
    myAxios()
      .put(pathTransmissionCampagne + idCampagneSelect, MapObjects(campagneToPut, 'campagne'))
      .then(() => {
        this.cleanAfterCall();
      })
      .catch(error => {
        if (error.response.request.status !== 200)
          this.setState({ formErrorComment: `Erreur de traitement` });
      });
  }

  suppressionCampagne() {
    const { idCampagneSelect } = this.state;
    myAxios()
      .delete(pathTransmissionCampagne + idCampagneSelect)
      .then(() => {
        this.cleanAfterCall();
      })
      .catch(error => {
        if (error.response.request.status !== 204)
          this.setState({ formErrorComment: `Erreur de traitement` });
      });
  }

  cleanAfterCall() {
    this.setState({
      showModalFormCampagne: false,
      showModalValidation: false,
      mode: modeEnum.CREATE,
    });
    this.cleanCampagneSelect();
    this.appelDonneesCampagnes();
  }

  campagneSelectionne() {
    const {
      idCampagneSelect,
      labelCampagneSelect,
      dateDebutCollecteSelect,
      dateFinCollecteSelect,
    } = this.state;

    return {
      idCampagne: idCampagneSelect,
      labelCampagne: labelCampagneSelect,
      dateDebutCollecte: dateDebutCollecteSelect,
      dateFinCollecte: dateFinCollecteSelect,
    };
  }

  handleFormChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => this.validateForm());
  }

  validateForm() {
    const {
      idCampagneSelect,
      labelCampagneSelect,
      dateDebutCollecteSelect,
      dateFinCollecteSelect,
    } = this.state;

    let error = '';

    const validIdCampagne = RegExp('^[A-Z]+[0-9]+[A-Z]+[0-9]+$').test(idCampagneSelect);
    const validLabelCampagne = RegExp('[a-zA-Z0-9_àâçéèêëîïôûùüÿñæœ .-]+').test(
      labelCampagneSelect
    );
    const validDateDebutCampagne =
      dateDebutCollecteSelect !== undefined && !Number.isNaN(dateDebutCollecteSelect);
    const validDateFinCampagne =
      dateFinCollecteSelect !== undefined && !Number.isNaN(dateFinCollecteSelect);
    const validDateOrder = dateFinCollecteSelect > dateDebutCollecteSelect;

    const validationResult =
      validIdCampagne &&
      validLabelCampagne &&
      validDateDebutCampagne &&
      validDateFinCampagne &&
      validDateOrder;

    if (!validIdCampagne) error = 'Id non valide. Exemple : FPE2019X00"';
    if (!validLabelCampagne) error += error === '' ? 'Label non valide' : ';Label non valide';
    if (!validDateDebutCampagne)
      error += error === '' ? 'Date de début non valide' : ';Date de début non valide';
    if (!validDateFinCampagne)
      error += error === '' ? 'Date de fin non valide' : ';Date de fin non valide';

    if (!validDateOrder)
      error +=
        error === ''
          ? 'La date de fin doit être postérieure à la date de début'
          : ';La date de fin doit être postérieure à la date de début';

    this.setState({ formErrorComment: error });

    this.setState({ formIsValid: validationResult });
  }

  appelDonneesCampagnes() {
    myAxios()
      .get(pathFinalCampagne)
      .then(res => {
        const campagnesFound = MapObjects(res.data.datas, 'campaign');
        this.setState({
          donnee: campagnesFound.sort((a, b) => a.labelCampagne.localeCompare(b.labelCampagne)),
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const {
      donnee,
      showModalFormCampagne,
      showModalValidation,
      mode,
      idCampagneSelect,
      labelCampagneSelect,
      dateDebutCollecteSelect,
      dateFinCollecteSelect,
      formIsValid,
      formErrorComment,
      loading,
    } = this.state;

    return (
      <>
        {loading && <Loader />}

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Label</th>
              <th>Date début collecte</th>
              <th>Date fin collecte</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donnee.map(({ idCampagne, labelCampagne, dateDebutCollecte, dateFinCollecte }) => (
              <LigneCampagne
                idCampagne={idCampagne}
                labelCampagne={labelCampagne}
                modificationCampagne={this.modificationCampagne}
                dateDebutCollecte={parseInt(dateDebutCollecte, 10)}
                dateFinCollecte={parseInt(dateFinCollecte, 10)}
                onOpenModalFormCampagne={this.onOpenModalFormCampagne}
                openValidationPanel={this.onValidateModalFormCampagne}
                handleFormChange={this.handleFormChange}
                setMode={this.setMode}
                setLoading={this.setLoading}
                selectCampagne={this.selectCampagne}
                key={idCampagne}
              />
            ))}
          </tbody>
        </table>
        {/*    <button
          type="button"
          className="btn btn-primary btn-sm btn-block glyphicon glyphicon-plus"
          title="Ajouter une enquête"
          onClick={() => this.onOpenModalFormCampagne()}
        /> */}

        <Modal
          open={showModalFormCampagne}
          onClose={() => this.onCloseModalFormCampagne()}
          closeIconSize={0}
          center
        >
          <CampagneForm
            mode={mode}
            idCampagne={idCampagneSelect}
            labelCampagne={labelCampagneSelect}
            dateDebutCollecte={dateDebutCollecteSelect}
            dateFinCollecte={dateFinCollecteSelect}
            handleFormChange={this.handleFormChange}
            validateForm={this.validateForm}
          />
          {!formIsValid && (
            <h3 style={{ color: 'red', textAlign: 'center' }}>Le formulaire n'est pas valide</h3>
          )}

          {formErrorComment.split(';').map(str => (
            <h4 style={{ color: 'red' }} key={str}>
              {str}
            </h4>
          ))}

          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!formIsValid}
            onClick={() => this.onValidateModalFormCampagne()}
          >
            Valider
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => this.onCloseModalFormCampagne()}
          >
            Annuler
          </button>
        </Modal>
        <Modal
          open={showModalValidation}
          onClose={() => this.onCloseModalFormCampagne()}
          closeIconSize={0}
          center
        >
          <h1>Confirmez-vous cette action ?</h1>
          {mode === modeEnum.DELETE && (
            <h3>
              {` Toute suppression est définitive, assurez-vous d'avoir extrait les données de cette
              enquête.`}
            </h3>
          )}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => this.onValidateModalValidation()}
            disabled={TableauCampagne.isCampaignOpen(this.campagneSelectionne(), mode)}
            title={
              TableauCampagne.isCampaignOpen(this.campagneSelectionne(), mode)
                ? "La suppression d'une enquête en cours de collecte est impossible."
                : ''
            }
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
      </>
    );
  }
}
