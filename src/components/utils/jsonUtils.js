const dico = {
  campaign: {
    id: 'idCampagne',
    collectionStartDate: 'dateDebutCollecte',
    collectionEndDate: 'dateFinCollecte',
    label: 'labelCampagne',
  },
  campagne: {
    idCampagne: 'id',
    dateDebutCollecte: 'collectionStartDate',
    dateFinCollecte: 'collectionEndDate',
    labelCampagne: 'label',
  },
  surveyUnit: {
    address: 'adresse',
    batchNumber: 'numeroDeLot',
    firstname: 'prenom',
    firstName: 'prenom',
    idSu: 'idUe',
    lastname: 'nom',
    status: 'statut',
  },
  monitoringProgress: {
    nbIntReceived: 'nbIntRecu',
    batchNumber: 'numeroDeLot',
    nbOtherWastes: 'nbAutresDechets',
    nbPapReceived: 'nbPapRecu',
    nbRefusal: 'nbRefus',
    nbSu: 'nbUe',
  },
  followUp: {
    batchNum: 'numlot',
  },
  infoSuiviGestion: {
    dateInfo: 'date',
    statut: 'status',
    idUe: 'idSu',
  },
  managementMonitoringInfos: {
    status: 'statut',
    idManagementMonitoringInfo: 'idInfosuivi',
  },
  uploadToFR: {
    id: 'id_upload',
    date: 'dateUpload',
  },
  uploadToEN: {
    statut: 'status',
    idUe: 'idSu',
    dateUpload: 'date',
  },
};

const dicoStatus = {
  toStatut: {
    REFUSAL: 'REFUS',
    WASTE: 'DECHET',
    FOLLOWUP: 'RELANCE',
    INITLA: 'INITLA',
    VALPAP: 'VALPAP',
    PARTIELINT: 'PARTIELINT',
    PND: 'PND',
    HC: 'HC',
    VALINT: 'VALINT',
  },
  toStatus: {
    REFUS: 'REFUSAL',
    DECHET: 'WASTE',
    RELANCE: 'FOLLOWUP',
    INITLA: 'INITLA',
    VALPAP: 'VALPAP',
    PARTIELINT: 'PARTIELINT',
    PND: 'PND',
    HC: 'HC',
    VALINT: 'VALINT',
  },
};

const MapObject = (obj, dicoType) => {
  const keys = Object.keys(dicoType);
  keys.forEach(element => {
    if (element === 'status') {
      obj[element] = dicoStatus.toStatut[obj[element]];
    }
    if (element === 'statut') {
      obj[element] = dicoStatus.toStatus[obj[element]];
    }
    if (Object.keys(obj).includes(element)) {
      Object.defineProperty(obj, dicoType[element], Object.getOwnPropertyDescriptor(obj, element));
      delete obj[element];
    }
  });
  return obj;
};

const MapObjects = (obj, type) => {
  if (Array.isArray(obj)) {
    obj.map(item => {
      if (type === 'campaign') {
        item = MapObject(item, dico.campaign);
      }
      if (type === 'surveyUnit') {
        item = MapObject(item, dico.surveyUnit);
      }
      if (type === 'progress') {
        item = MapObject(item, dico.monitoringProgress);
      }
      if (type === 'followup') {
        item = MapObject(item, dico.followUp);
      }
      if (type === 'uploadFR') {
        item = MapObject(item, dico.uploadToFR);
      }
      if (type === 'uploadEN') {
        item = MapObject(item, dico.uploadToEN);
      }
      if (type === 'managementMonitoringInfo') {
        item.uniteEnquete = MapObject(item.surveyUnit, dico.surveyUnit);
        item.uniteEnquete.campagne = MapObject(item.uniteEnquete.campaign, dico.campaign);
        item = MapObject(item, dico.managementMonitoringInfos);
        delete item.surveyUnit;
        delete item.uniteEnquete.campaign;
      }
      if (type === 'infoSuiviGestion') {
        item = MapObject(item, dico.infoSuiviGestion);
      }

      if (type === 'surveyUnitFilter') {
        item = MapObject(item, dico.surveyUnit);
        item.campagne = MapObject(item.campaign, dico.campaign);

        delete item.campaign;
      }
      return item;
    });
  } else {
    if (type === 'campaign') {
      obj = MapObject(obj, dico.campaign);
    }
    if (type === 'campagne') {
      obj = MapObject(obj, dico.campagne);
    }
    if (type === 'surveyUnit') {
      obj = MapObject(obj, dico.surveyUnit);
    }
    if (type === 'infoSuiviGestion') {
      obj.data = MapObjects(obj.data, 'infoSuiviGestion');
    }
  }

  return obj;
};

export default MapObjects;
