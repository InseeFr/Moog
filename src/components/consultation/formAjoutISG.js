import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { statusIsgAutorises } from '../../utils/properties';

const Form = ({ closeModal, uniteEnquete, ajouterISG }) => {
  const [isg, setIsg] = useState({
    idUe: uniteEnquete.idUe,
    idContact: uniteEnquete.idContact,
    dateInfo: new Date().getTime(),
    statut: undefined,
  });
  const campagneId = uniteEnquete.campagne.idCampagne;
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(isg.statut !== undefined);
  }, [isg]);

  const onChange = event => {
    setIsg({ ...isg, statut: event.target.value });
  };

  const save = () => {
    ajouterISG(campagneId, isg);
  };

  return (
    <div className="form">
      <label htmlFor="infoSuiviGestion">
        <select
          type="list"
          id="infoSuiviGestion"
          name="infoSuiviGestion"
          onChange={onChange}
          defaultValue="placeholder"
          required
        >
          <option disabled hidden value="placeholder">
            Choisir le signalement à ajouter
          </option>
          <option value={statusIsgAutorises.VALPAP.type}>
            {statusIsgAutorises.VALPAP.libelle}
          </option>
          <option value={statusIsgAutorises.PND.type}>{statusIsgAutorises.PND.libelle}</option>
          <option value={statusIsgAutorises.HC.type}>{statusIsgAutorises.HC.libelle}</option>
          <option value={statusIsgAutorises.REFUS.type}>{statusIsgAutorises.REFUS.libelle}</option>
          <option value={statusIsgAutorises.DECHET.type}>
            {statusIsgAutorises.DECHET.libelle}
          </option>
        </select>
      </label>

      <div className="buttonsGroup">
        <button type="button" onClick={save} disabled={!formIsValid}>
          <i className="fa fa-check" aria-hidden="true" />
          Enregistrer
        </button>
        <button type="button" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true" />
          Annuler
        </button>
      </div>
    </div>
  );
};

export default Form;
Form.propTypes = {
  uniteEnquete: PropTypes.shape({
    idUe: PropTypes.string.isRequired,
    idContact: PropTypes.string.isRequired,
    campagne: PropTypes.shape({
      idCampagne: PropTypes.string.isRequired,
      labelCampagne: PropTypes.string.isRequired,
      dateDebutCollecte: PropTypes.number.isRequired,
      dateFinCollecte: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  ajouterISG: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
