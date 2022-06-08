import PropTypes from 'prop-types';
import React from 'react';
import estGestionnaire from 'utils/roles';

export default function Ue(props) {
  const {
    idContact,
    idUe,
    campagne,
    Nom,
    Prenom,
    Lien,
    AppelHistorique,
    AppelMail,
    adresse,
    roles,
  } = props;
  const isGestionnaire = estGestionnaire(roles);
  return (
    <tr id={idUe + '-' + campagne.idCampagne}>
      <td>{idContact}</td>
      {isGestionnaire && <td>{idUe}</td>}
      <td>{adresse}</td>
      <td>{campagne.labelCampagne}</td>
      {isGestionnaire && <td>{Nom}</td>}
      {isGestionnaire && <td>{Prenom}</td>}
      <td>
        {isGestionnaire && (
          <button
            type="button"
            className="btn btn-secondary btn-sm glyphicon glyphicon-calendar"
            title="Accéder au questionnaire"
            onClick={() => Lien({ idUe })}
          />
        )}
        <button
          type="button"
          className="btn btn-secondary btn-sm glyphicon glyphicon-search"
          title="Historique"
          onClick={() => AppelHistorique({ idUe, idContact, campagne })}
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm glyphicon glyphicon-envelope"
          title="Mail"
          onClick={() => AppelMail({ idUe, idContact, campagne })}
        />
      </td>
    </tr>
  );
}

Ue.propTypes = {
  idContact: PropTypes.string.isRequired,
  idUe: PropTypes.string.isRequired,
  Nom: PropTypes.string.isRequired,
  Prenom: PropTypes.string.isRequired,
  Lien: PropTypes.func.isRequired,
  AppelHistorique: PropTypes.func.isRequired,
  AppelMail: PropTypes.func.isRequired,
  adresse: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
