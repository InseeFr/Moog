import React from 'react';
import PropTypes from 'prop-types';
import '../../index.css';
import TableauCollecte from './tableauCollecte';
import TableauRelance from './tableauRelance';

function Formateddate() {
  const tempDate = new Date();
  let jour;
  let mois;
  if (tempDate.getDate() < 10) {
    jour = `0${tempDate.getDate()}`;
  } else {
    jour = tempDate.getDate();
  }
  if (tempDate.getMonth() < 9) {
    mois = `0${tempDate.getMonth() + 1}`;
  } else {
    mois = tempDate.getMonth() + 1;
  }
  return `${jour}/${mois}/${tempDate.getFullYear()}`;
}

export default function Avancement(props) {
  const { id } = props;
  return (
    <>
      <div className="col-md-12">
        <h2>Tableau d'avancement de la collecte du {Formateddate()}</h2>
        <TableauCollecte id={id} />
        <h2>Tableau des relances du {Formateddate()}</h2>
        <TableauRelance id={id} />
      </div>
    </>
  );
}

Avancement.propTypes = {
  id: PropTypes.string.isRequired,
};
