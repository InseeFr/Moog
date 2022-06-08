import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import myAxios from 'utils/api-call';
import '../../index.css';
import {
  pathListUploads,
  pathSuppressionUpload,
  pathTransmissionCampagne,
} from '../../utils/properties';
import Upload from './upload';
import MapObjects from '../utils/jsonUtils';

export default class Historique extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donnee: [],
      idUploadASupprimer: '',
      openModal: false,
    };
  }

  componentWillMount() {
    const { id } = this.props;
    myAxios()
      .get(pathTransmissionCampagne + id + pathListUploads)
      .then(res => {
        this.triDonnee(MapObjects(res.data.datas, 'uploadFR'));
      })
      .catch(error => {
        console.log(error);
      });
  }

  triDonnee(data) {
    data.sort(function(a, b) {
      return b.dateUpload - a.dateUpload;
    });
    this.setState({ donnee: data });
  }

  onOpenModal(idUpload) {
    this.setState({ openModal: true, idUploadASupprimer: idUpload.id_upload });
  }

  onCloseModal() {
    this.setState({ openModal: false });
  }

  SupprimerUpload() {
    const { idUploadASupprimer } = this.state;

    myAxios()
      .delete(pathSuppressionUpload + idUploadASupprimer)
      .then(response => {
        if (response.status === 204) {
          document.getElementById(idUploadASupprimer).style.display = 'none';
        }
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ openModal: false });
  }

  render() {
    const { donnee, openModal } = this.state;
    return (
      <div className="container">
        <h2>Historique des uploads</h2>
        <table id="tableauHistorique" className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donnee.map(({ id_upload, dateUpload }) => (
              <Upload
                idUpload={id_upload}
                dateUpload={dateUpload}
                onOpenModal={() => this.onOpenModal({ id_upload })}
                key={id_upload}
              />
            ))}
          </tbody>
        </table>
        <Modal open={openModal} onClose={() => this.onCloseModal()} closeIconSize={0} center>
          <h1>Etes-vous sûr?</h1>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => this.SupprimerUpload()}
          >
            {' '}
            Oui
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => this.onCloseModal()}
          >
            {' '}
            Non
          </button>
        </Modal>
      </div>
    );
  }
}
