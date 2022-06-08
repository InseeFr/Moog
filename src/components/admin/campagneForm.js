import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { modeEnum } from '../../utils/properties';

function returnDateChange(event, funct) {
  const timeStamp = new Date(event.target.value).getTime();
  const { name } = event.target;
  const newEvent = Object.assign(event, { target: { value: timeStamp, name } });
  funct(newEvent);
}

export default class CampagneForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { validateForm } = this.props;
    validateForm();
  }

  render() {
    const {
      mode,
      idCampagne,
      labelCampagne,
      dateDebutCollecte,
      dateFinCollecte,
      handleFormChange,
    } = this.props;

    return (
      <>
        <h1>
          {mode === modeEnum.CREATE ? `Créer une nouvelle enquête` : `Modifier une enquête`}
        </h1>
        <form>
          <div className="form-group">
            <label className="form-label" htmlFor="idCampagne" value="idCampagne">
              <>Identifiant</>
              <input
                className="form-control"
                type="text"
                id="idCampagne"
                name="idCampagneSelect"
                value={idCampagne}
                onChange={e => handleFormChange(e)}
                disabled={mode !== modeEnum.CREATE}
                pattern="^[A-Z]+[0-9]+[A-Z]+[0-9]+$"
                required
                title="L'identifiant doit être constitué de majuscules et de chiffres. Les espaces et caractères spéciaux ne sont pas autorisés. Exemple : TIC2020X00"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="labelCampagne">
              <>Label</>
              <input
                className="form-control"
                type="text"
                id="labelCampagne"
                name="labelCampagneSelect"
                value={labelCampagne}
                required
                onChange={e => handleFormChange(e)}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dateDebutCollecte">
              <>Début de la collecte</>
              <input
                className="form-control"
                type="date"
                id="dateDebutCollecte"
                name="dateDebutCollecteSelect"
                value={new Date(dateDebutCollecte).toLocaleDateString('fr-CA')}
                required
                onChange={e => returnDateChange(e, handleFormChange)}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dateFinCollecte">
              <>Fin de la collecte</>
              <input
                className="form-control"
                type="date"
                id="dateFinCollecte"
                name="dateFinCollecteSelect"
                value={new Date(dateFinCollecte).toLocaleDateString('fr-CA')}
                required
                onChange={e => returnDateChange(e, handleFormChange)}
              />
            </label>
          </div>
        </form>
      </>
    );
  }
}

CampagneForm.propTypes = {
  mode: PropTypes.string.isRequired,
  idCampagne: PropTypes.string.isRequired,
  labelCampagne: PropTypes.string.isRequired,
  dateDebutCollecte: PropTypes.number.isRequired,
  dateFinCollecte: PropTypes.number.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
};
