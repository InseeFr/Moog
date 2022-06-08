import PropTypes from 'prop-types';
import React from 'react';
import estGestionnaire from 'utils/roles';
import '../../index.css';
import TableauCampagne from './tableauCampagne';

export default function Admin(props) {
  const { roles } = props;
  const isGestionnaire = estGestionnaire(roles);

  return (
    <>
      {isGestionnaire && (
        <div className="col-md-12">
          <h2>Gestion des enquêtes</h2>
          <TableauCampagne />
        </div>
      )}
      {!isGestionnaire && (
        <div className="col-md-12">
          <h2>Gestion des enquêtes</h2>
          <p>Vous n'avez pas les droits pour accéder à cette page.</p>
        </div>
      )}
    </>
  );
}
Admin.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
