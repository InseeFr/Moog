/* Rôles pour l'application */
export const GESTIONNAIRE_ROLE = "gestionnairemoog_Capi3G";
export const ASSISTANCE_ROLE = "assistancemoog_Capi3G";

/* statuts infoSuiviGestion autorisés lors de l'import */
export const reponseAttenduDansCSV = {
  VALPAP: "VALPAP",
  PND: "PND",
  REFUS: "REFUS",
  DECHET: "DECHET",
  HC: "HC",
  RELANCE: "RELANCE",
};
/* statuts infoSuiviGestion exlus pour suppression unitaire d'une infoSuiviGestion dans l'historique */
export const boutonSupprimerCondition = {
  VALINT: "VALINT",
  PARTIELINT: "PARTIELINT",
  INITLA: "INITLA",
  RELANCE: "RELANCE",
};
/* status infoSuiviGestion autorises pour l'ajout manuel d'une infoSuiviGestion dans l'historique */
export const statusIsgAutorises = {
  VALPAP: { type: "VALPAP", libelle: "Papier reçu" },
  PND: { type: "PND", libelle: "PND" },
  HC: { type: "HC", libelle: "Hors champ" },
  REFUS: { type: "REFUS", libelle: "Refus" },
  DECHET: { type: "DECHET", libelle: "Autres déchets" },
};

/*  */
export const modeEnum = {
  CREATE: "CREATION",
  UPDATE: "MODIFICATION",
  DELETE: "SUPPRESSION",
};
/* Nom colonne Identifiant idUE dans CSV */
export const idUe = "idUe";
/* Nom colonne Identifiant idContact dans CSV */
export const idContact = "idContact";
/* Nom colonne statut InfoSuiviGestion dans CSV */
export const statut = "statut";
/* Libelles autorises pour CSV */
export const libellesAutorises = [
  "idUe",
  "statut",
  "numeroDeLot",
  "idContact",
  "pnd",
];

/* longueur de l'identifiant idUe */
export const longueurMinIdUe = 1;
/* longueur de l'identifiant du contact */
export const longueurIdContactMin = 7;
export const longueurIdContactMax = 8;
/* Nombre de colonnes dans le fichier à importer */
export const nbChamps = [3, 4, 5];


/* path pour recherche */
export const pathConsultationFiltre = "/survey-units?filter1=";
/* path pour suppression d'un suivi */
export const pathUniteEnquete = "/survey-units";
/* path pour suppression d'un suivi */
export const pathInfoSuiviGestion = "/management-monitoring-info";
export const pathInfoSuiviGestions = "/management-monitoring-infos/";
/* path pour suppression d'un upload */
export const pathSuppressionUpload = "/uploads/";
/*  path pour le post des infosuivigestion */
export const pathEnregistrerInfoSuiviGestion = "/uploads";
/*  path pour le post des infosuivigestion */
export const pathListUploads = "/uploads";
/*  path pour le get des unités enquetées à relancer */
export const pathListRelance = "/survey-units/follow-up";
/*  path pour le get du tableau du suivi d'avancement */
export const pathAvancement = "/monitoring/progress";
/*  path pour le get du tableau du suivi de relance */
export const pathRelance = "/monitoring/follow-up";
/*  path pour le get de l'extraction de donnees d'une campagne */
export const pathExtraction = "/extraction";
/* path pour la liste des campagnes */
export const pathFinalCampagne = "/campaigns";
/* path générique pour les requête */
export const pathTransmissionCampagne = "/campaigns/";
/* path contact */
export const pathContact = "/contact";
/* path mail */
export const pathMail = "/mail";
/*path readOnly*/
export const pathReadonly = "/readonly/campaigns/";
