import PropTypes from 'prop-types';
import React from 'react';
import estGestionnaire from 'utils/roles';

export default function Histoire(props) {
  const {
    DateD,
    Statut,
    onOpenModalSupprimerSuivie,
    SupprimerCondition,
    IdInfosuivi,
    roles,
  } = props;
  const isGestionnaire = estGestionnaire(roles);
  const te = { DateD };
  const t = new Date(te.DateD);
  const jour = t.toLocaleDateString();
  const heure = t.toLocaleTimeString();

  return (
    <tr id={IdInfosuivi}>
      <td>{jour}</td>
      <td>{heure}</td>
      <td>{Statut}</td>
      {isGestionnaire && (
        <td>
          {!({ Statut }.Statut in SupprimerCondition) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm glyphicon glyphicon-trash center-block"
              title="Supprimer"
              onClick={() => onOpenModalSupprimerSuivie({ IdInfosuivi })}
            />
          )}
        </td>
      )}
    </tr>
  );
}

Histoire.propTypes = {
  DateD: PropTypes.number.isRequired,
  Statut: PropTypes.string.isRequired,
  onOpenModalSupprimerSuivie: PropTypes.func.isRequired,
  SupprimerCondition: PropTypes.func.isRequired,
  IdInfosuivi: PropTypes.number.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
