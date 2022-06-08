import React from 'react';
import PropTypes from 'prop-types';

export default function Upload(props) {
  const { idUpload, dateUpload, onOpenModal } = props;
  const te = { dateUpload };
  const t = new Date(te.dateUpload);
  const jourUpload = t.toLocaleDateString();
  const heureUpload = t.toLocaleTimeString();

  return (
    <tr id={idUpload}>
      <td>{jourUpload}</td>
      <td>{heureUpload}</td>
      <td>
        {
          <button
            type="button"
            className="btn btn-secondary btn-sm glyphicon glyphicon-trash"
            title="Revert upload"
            onClick={() => onOpenModal({ idUpload })}
          />
        }
      </td>
    </tr>
  );
}

Upload.propTypes = {
  idUpload: PropTypes.number.isRequired,
  dateUpload: PropTypes.number.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};
