import HistoireContainer from "containers/histoire";
import UeContainer from "containers/ue";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-responsive-modal";
import myAxios from "utils/api-call";
import estGestionnaire from "utils/roles";
import MapObjects from "../utils/jsonUtils";
import "../../index.css";
import {
  boutonSupprimerCondition,
  pathConsultationFiltre,
  pathContact,
  pathEndSiteMiroir,
  pathEnregistrerInfoSuiviGestion,
  pathFinalCampagne,
  pathInfoSuiviGestions,
  pathMail,
  pathStartSiteMiroir,
  pathTransmissionCampagne,
  pathUniteEnquete,
} from "../../utils/properties";
import Form from "./formAjoutISG";

const Consultation = ({ roles, linkQuestionnaire, urlColemanPromotion }) => {
  const convertTimeStampToFormattedDate = (isg) => {
    const timestamp = isg.dateInfo;
    // expected format : "dd-MM-yyyy hh:mm"
    const date = new Date(timestamp);
    let day = date.getDate();
    if (parseInt(day, 10) < 10) {
      day = `0${day}`;
    }
    let month = date.getMonth() + 1;
    if (parseInt(month, 10) < 10) {
      month = `0${month}`;
    }
    const year = date.getFullYear();
    let hours = date.getHours();
    if (parseInt(hours, 10) < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (parseInt(minutes, 10) < 10) {
      minutes = `0${minutes}`;
    }

    const newDateInfo = `${day}-${month}-${year} ${hours}:${minutes}`;
    return { ...isg, dateInfo: newDateInfo };
  };

  const [ueFiltree, setUeFiltree] = useState([]);
  const [motFiltre, setMotFiltre] = useState("");
  const [ueSelectionne, setUeSelectionne] = useState(undefined);
  const [historiqueSelectionne, setHistoriqueSelectionne] = useState([]);
  const [isMailTableauVisible, setIsMailTableauVisible] = useState(false);
  const [idSuiviASupprimer, setIdSuiviASupprimer] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [mail, setMail] = useState(null);
  const [itemsCountPerPage, setItemsCountPerPage] = useState(null);
  const [totalItemsCount, setTotalItemsCount] = useState(null);
  const [hauteurSelection, setHauteurSelection] = useState(null);
  const [openModalSupprimerSuivie, setOpenModalSupprimerSuivie] = useState(
    false
  );
  const [openModalAddISG, setOpenModalAddISG] = useState(false);
  const [openModalReset, setOpenModalReset] = useState(false);

  const anyDataFetched = () => ueFiltree.length > 0;
  const isHistoryTableVisible = () => historiqueSelectionne.length > 0;
  const isGestionnaire = estGestionnaire(roles);
  const campaignIsClosed = () => {
    const {
      campagne: { dateFinCollecte, dateDebutCollecte },
    } = ueSelectionne;
    const start = parseInt(dateDebutCollecte, 10);
    const end = parseInt(dateFinCollecte, 10);
    const now = new Date().getTime();
    return now > end || now < start;
  };

  useEffect(() => {
    const filtre = (bdd) => {
      const newItemsCountPerPage = bdd.size;
      const newTotalItemsCount = bdd.totalElements;
      console.log(bdd.content);
      const results = MapObjects(bdd.content, "surveyUnitFilter");
      const updatedResults = results.map((result) => {
        const timestamp = new Date(result.pubDate);
        console.log(timestamp);
        const dateString = timestamp.toGMTString();
        return {
          ...result,
          dateString,
        };
      });

      setIsMailTableauVisible(false);
      setTotalItemsCount(newTotalItemsCount);
      setItemsCountPerPage(newItemsCountPerPage);
      setUeFiltree(updatedResults);
    };

    const fetchURL = (page, motFiltre1, motFiltre2) => {
      let path = pathFinalCampagne + pathConsultationFiltre + motFiltre1;
      if (motFiltre2 !== null) {
        path = `${path}&filter2=${motFiltre2}`;
      }
      path = `${path}&pageNo=${page}&pageSize=25`;

      myAxios()
        .get(path)
        .then((res) => {
          filtre(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    setHistoriqueSelectionne([]);

    if (motFiltre.length > 2) {
      if (estGestionnaire(roles)) {
        fetchURL(activePage - 1, motFiltre, motFiltre);
      } else {
        fetchURL(activePage - 1, motFiltre, null);
      }
    } else {
      setIsMailTableauVisible(false);
      setUeFiltree([]);
    }
  }, [motFiltre, activePage]);

  const linkSiteMirroir = (obj) => {
    const {
      campagne: { idCampagne },
      idUe,
    } = obj;
    window.open(
      `${linkQuestionnaire}${pathStartSiteMiroir}${idCampagne}${pathEndSiteMiroir}${idUe}`
    );
  };

  const appel = (history) => {
    setIsMailTableauVisible(false);
    setHistoriqueSelectionne(history);
  };

  const ajustTopMargin = (ue) => {
    const el = document.getElementById(`${ue.idUe}-${ue.campagne.idCampagne}`);
    setHauteurSelection(el.offsetTop + 30);
    setUeSelectionne(ue);
  };

  const appelHistorique = (ue) => {
    myAxios()
      .get(
        `${pathTransmissionCampagne}${ue.campagne.idCampagne}${pathUniteEnquete}/${ue.idUe}${pathInfoSuiviGestions}`
      )
      .then((res) => {
        appel(MapObjects(res.data.datas, "managementMonitoringInfo"));
      })
      .catch((error) => {
        console.log(error);
      });

    ajustTopMargin(ue);
  };

  const openDeleteForm = (id) => {
    setIdSuiviASupprimer(id);
    setOpenModalSupprimerSuivie(true);
  };

  const closeDeleteForm = () => {
    setOpenModalSupprimerSuivie(false);
  };

  // cf autre commentaire sur cinématique de cette fonction
  const onOpenModalReset = () => {
    window.open(`${urlColemanPromotion}/log/assistance`, "_blank");
    // this.setState({
    //   openModalReset: true,
    // });
  };

  const onCloseModalReset = () => {
    setOpenModalReset(false);
  };

  const openAddISGForm = () => {
    setOpenModalAddISG(true);
  };

  const closeAddISGForm = () => {
    setOpenModalAddISG(false);
  };

  const supprimerSuivi = async () => {
    const deletion = async () => {
      await myAxios()
        .delete(pathInfoSuiviGestions + idSuiviASupprimer)
        .catch((error) => {
          console.log(error);
        });
    };
    await deletion();
    appelHistorique(ueSelectionne);

    closeDeleteForm();
  };

  const ajouterISG = (campagneId, isg) => {
    const formattedIsg = convertTimeStampToFormattedDate(isg);
    console.log(formattedIsg);

    const upload = MapObjects({ data: [isg] }, "infoSuiviGestion");
    myAxios()
      .post(
        pathTransmissionCampagne + campagneId + pathEnregistrerInfoSuiviGestion,
        upload
      )
      .catch((error) => {
        // TODO : show the result of api call
        console.log(error);
      })
      .finally(() => {
        appelHistorique(ueSelectionne);
        closeAddISGForm();
      });
  };

  const updateMail = (newMail) => {
    setHistoriqueSelectionne([]);
    setIsMailTableauVisible(true);
    setMail(newMail);
  };

  const appelMail = (ue) => {
    myAxios()
      .get(`${pathContact}/${ue.idContact}${pathMail}`)
      .then((res) => {
        updateMail(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    ajustTopMargin(ue);
  };

  return (
    <div className="container">
      <div className="col-md-9">
        <input
          className="form-control"
          type="text"
          placeholder="Taper trois lettres minimum pour lancer la recherche"
          onChange={(e) => {
            setMotFiltre(e.target.value);
            setActivePage(1);
          }}
        />

        {!anyDataFetched() && motFiltre.length > 2 && (
          <h5 style={{ color: "red" }}>
            La requête n'a pas renvoyé de données, votre chaîne de caractères
            n'a pas été trouvée dans la base de données.
          </h5>
        )}

        <br />
        {anyDataFetched() && (
          <div>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Identifiant Internet</th>
                  {isGestionnaire && <th>Identifiant Echantillon </th>}
                  <th>Commune</th>
                  <th>Enquête</th>
                  {isGestionnaire && <th>Nom</th>}
                  {isGestionnaire && <th>Prénom</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ueFiltree.map(
                  ({ campagne, idUe, idContact, nom, prenom, adresse }) => (
                    <UeContainer
                      idContact={idContact}
                      idUe={idUe}
                      campagne={campagne}
                      adresse={adresse}
                      Nom={nom}
                      Prenom={prenom}
                      AppelHistorique={() =>
                        appelHistorique({ idUe, idContact, campagne })
                      }
                      AppelMail={() => appelMail({ idUe, idContact, campagne })}
                      Lien={() => linkSiteMirroir({ idUe, campagne })}
                      // generating unique keys by adding campagneId
                      key={`${idUe}_${campagne.idCampagne}`}
                    />
                  )
                )}
              </tbody>
            </table>
            <div className="text-center">
              <Pagination
                hideNavigation={true}
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={totalItemsCount}
                pageRangeDisplayed={10}
                itemClass="page-item"
                linkClass="btn btn-light"
                onChange={(pageNumber) => setActivePage(pageNumber)}
              />
            </div>
          </div>
        )}
      </div>

      {isHistoryTableVisible() && (
        <div
          className="col-md-3"
          style={{ marginTop: `${hauteurSelection}px` }}
        >
          <h3>{`Historique de ${ueSelectionne.idContact}`}</h3>
          <table
            id="tableauSuiviConsultation"
            className="table table-bordered table-striped"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Statut</th>
                {isGestionnaire && <th>Suppression</th>}
              </tr>
            </thead>
            <tbody>
              {historiqueSelectionne
                .sort((a, b) => a.dateInfo - b.dateInfo)
                .map(({ idInfosuivi, statut, dateInfo }) => (
                  <HistoireContainer
                    DateD={dateInfo}
                    Statut={statut}
                    IdInfosuivi={idInfosuivi}
                    onOpenModalSupprimerSuivie={() =>
                      openDeleteForm(idInfosuivi)
                    }
                    SupprimerCondition={boutonSupprimerCondition}
                    key={idInfosuivi}
                  />
                ))}
            </tbody>
          </table>
          {isGestionnaire && (
            <button
              type="button"
              className="btn btn-primary btn-lg glyphicon"
              title="Ajouter un signalement"
              onClick={() => openAddISGForm()}
              disabled={campaignIsClosed()}
            >
              <i className="glyphicon glyphicon-plus" />
              {` Ajouter `}
            </button>
          )}
        </div>
      )}
      {isMailTableauVisible && (
        <div
          className="col-md-3"
          style={{ marginTop: `${hauteurSelection}px` }}
        >
          <h3>{`Mail de ${ueSelectionne.idContact}`}</h3>
          <table
            id="tableauSuiviConsultation"
            className="table table-bordered table-striped"
          >
            <thead>
              <tr>
                <th>Mail</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="500">{` ${mail} `}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm glyphicon glyphicon-refresh center-block"
                    title="Reinitialiser le mot de passe"
                    onClick={() => onOpenModalReset()}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <Modal
        open={openModalSupprimerSuivie}
        onClose={() => closeDeleteForm()}
        closeIconSize={0}
        center
      >
        <h1>Êtes-vous sûr ?</h1>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => supprimerSuivi()}
        >
          Oui
        </button>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => closeDeleteForm()}
        >
          Non
        </button>
      </Modal>
      {/* vérifier la cinétique du bouton : formulaire intermédaire ou pas. Oui et Non mènent au même comportement */}
      <Modal
        open={openModalReset}
        onClose={() => onCloseModalReset()}
        closeIconSize={0}
        center
      >
        <h1>Êtes-vous sûr?</h1>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => onCloseModalReset()}
        >
          Oui
        </button>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => onCloseModalReset()}
        >
          Non
        </button>
      </Modal>
      <Modal
        open={openModalAddISG}
        onClose={() => closeAddISGForm()}
        closeIconSize={0}
        center
      >
        <Form
          closeModal={() => closeAddISGForm()}
          uniteEnquete={ueSelectionne}
          ajouterISG={ajouterISG}
        />
      </Modal>
    </div>
  );
};
export default Consultation;
Consultation.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  linkQuestionnaire: PropTypes.string.isRequired,
  urlColemanPromotion: PropTypes.string.isRequired,
};
