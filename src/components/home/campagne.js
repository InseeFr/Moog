import PropTypes from 'prop-types';
import React from 'react';

export default function Campagne(props) {
  const { idCampagne, labelCampagne } = props;
  return <option value={idCampagne}>{labelCampagne}</option>;
}

Campagne.propTypes = {
  idCampagne: PropTypes.string.isRequired,
  labelCampagne: PropTypes.string.isRequired,
};

