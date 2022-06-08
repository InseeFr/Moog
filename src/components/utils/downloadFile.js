import React from 'react';
import myAxios from 'utils/api-call';
import saveAs from 'file-saver';
import { parse } from 'json2csv';
import PropTypes from 'prop-types';
import MapObjects from '../utils/jsonUtils';

const DownloadFile = ({ fileName, url, setLoading }) => {
  const apiCall = () => {
    setLoading(true);
    myAxios()
      .get(url)
      .then(toBeCleanedRes => {
        const cleanedRes = toBeCleanedRes;
        const { datas } = cleanedRes.data;
        const newDonnees = datas.map(ligne => {
          const newLigne = ligne;
          const { dateInfo } = newLigne;
          const date = new Date(dateInfo);
          const year = date.getFullYear();
          const month = `0${date.getMonth() + 1}`.slice(-2);
          const day = `0${date.getDate()}`.slice(-2);
          const hour = `0${date.getHours()}`.slice(-2);
          const minute = `0${date.getMinutes()}`.slice(-2);
          const second = `0${date.getSeconds()}`.slice(-2);
          newLigne.dateInfo = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
          return newLigne;
        });
        cleanedRes.data.datas = newDonnees;
        return cleanedRes;
      })
      .then(res => {
        const fields = [
          'statut',
          'dateInfo',
          'idUe',
          'idContact',
          'nom',
          'prenom',
          'adresse',
          'numeroDeLot',
        ];
        const opts = { fields };
        const datas = MapObjects(res.data.datas, 'surveyUnit');
        setLoading(false);
        let csv;
        try {
          csv = parse(datas, opts);
        } catch (err) {
          console.error(err);
        }
        const blob = new Blob([csv], { type: 'application/json' });
        saveAs(blob, fileName);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm glyphicon glyphicon-save"
      title="Extraire les données"
      onClick={() => apiCall()}
    />
  );
};

export default DownloadFile;

DownloadFile.propTypes = {
  fileName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
};
