import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { modeEnum } from 'utils/properties';
import { pathExtraction, pathTransmissionCampagne } from '../../utils/properties';
import DownloadFile from '../utils/downloadFile';

export default class LigneCampagne extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  appelEdition() {
    const {
      idCampagne,
      labelCampagne,
      dateDebutCollecte,
      dateFinCollecte,
      onOpenModalFormCampagne,
      setMode,
      selectCampagne,
    } = this.props;

    setMode(modeEnum.UPDATE);
    selectCampagne({
      idCampagneSelect: idCampagne,
      labelCampagneSelect: labelCampagne,
      dateDebutCollecteSelect: dateDebutCollecte,
      dateFinCollecteSelect: dateFinCollecte,
    });

    onOpenModalFormCampagne();
  }

  appelSuppression() {
    const {
      idCampagne,
      labelCampagne,
      dateDebutCollecte,
      dateFinCollecte,
      openValidationPanel,
      setMode,
      selectCampagne,
    } = this.props;

    setMode(modeEnum.DELETE);
    selectCampagne({
      idCampagneSelect: idCampagne,
      labelCampagneSelect: labelCampagne,
      dateDebutCollecteSelect: dateDebutCollecte,
      dateFinCollecteSelect: dateFinCollecte,
    });

    openValidationPanel();
  }

  render() {
    const { idCampagne, labelCampagne, dateDebutCollecte, dateFinCollecte } = this.props;
    const localDateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const { setLoading } = this.props;
    return (
      <tr id={idCampagne}>
        <td>{idCampagne}</td>
        <td>{labelCampagne}</td>
        <td>{new Date(dateDebutCollecte).toLocaleDateString('fr-FR', localDateOptions)}</td>
        <td>{new Date(dateFinCollecte).toLocaleDateString('fr-FR', localDateOptions)}</td>
        <td>
          <button
            type="button"
            className="btn btn-secondary btn-sm glyphicon glyphicon-pencil"
            title="Modifier"
            onClick={() => this.appelEdition()}
          />
          <DownloadFile
            fileName={`extraction-${idCampagne}-${new Date().toLocaleDateString()}.csv`}
            url={pathTransmissionCampagne + idCampagne + pathExtraction}
            setLoading={setLoading}
          />

          <button
            type="button"
            className="btn btn-secondary btn-sm glyphicon glyphicon-trash"
            title="Supprimer"
            onClick={() => this.appelSuppression()}
          />
        </td>
      </tr>
    );
  }
}
LigneCampagne.propTypes = {
  idCampagne: PropTypes.string.isRequired,
  labelCampagne: PropTypes.string.isRequired,
  dateDebutCollecte: PropTypes.number.isRequired,
  dateFinCollecte: PropTypes.number.isRequired,
  onOpenModalFormCampagne: PropTypes.func.isRequired,
  openValidationPanel: PropTypes.func.isRequired,
  selectCampagne: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
