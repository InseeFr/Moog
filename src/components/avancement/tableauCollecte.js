import React, { Component } from "react";
import "../../index.css";
import myAxios from "utils/api-call";
import VagueCollecte from "./vagueCollecte";
import {
  pathAvancement,
  pathTransmissionCampagne,
} from "../../utils/properties";
import MapObjects from "../utils/jsonUtils";

export default class TableauCollecte extends Component {
  static calculTotaux(donnees) {
    donnees[donnees.length] = {
      numeroDeLot: "Total",
      nbUe: donnees.reduce((accumulator, vague) => accumulator + vague.nbUe, 0),
      nbIntRecu: donnees.reduce(
        (accumulator, vague) => accumulator + vague.nbIntRecu,
        0
      ),
      nbPapRecu: donnees.reduce(
        (accumulator, vague) => accumulator + vague.nbPapRecu,
        0
      ),
      nbPND: donnees.reduce(
        (accumulator, vague) => accumulator + vague.nbPND,
        0
      ),
      nbHC: donnees.reduce((accumulator, vague) => accumulator + vague.nbHC, 0),
      nbRefus: donnees.reduce(
        (accumulator, vague) => accumulator + vague.nbRefus,
        0
      ),
      nbAutresDechets: donnees.reduce(
        (accumulator, vague) => accumulator + vague.nbAutresDechets,
        0
      ),
      nbIntPart: donnees.reduce(
        (accumulator, vague) => accumulator + vague.nbIntPart,
        0
      ),
    };

    const total = donnees[donnees.length - 1].nbUe;

    donnees[donnees.length] = {
      numeroDeLot: "Total en %",
      nbUe: 100,
      nbIntRecu:
        total === 0 ? 0 : (donnees[donnees.length - 1].nbIntRecu / total) * 100,
      nbPapRecu:
        total === 0 ? 0 : (donnees[donnees.length - 1].nbPapRecu / total) * 100,
      nbPND:
        total === 0 ? 0 : (donnees[donnees.length - 1].nbPND / total) * 100,
      nbHC: total === 0 ? 0 : (donnees[donnees.length - 1].nbHC / total) * 100,
      nbRefus:
        total === 0 ? 0 : (donnees[donnees.length - 1].nbRefus / total) * 100,
      nbAutresDechets:
        total === 0
          ? 0
          : (donnees[donnees.length - 1].nbAutresDechets / total) * 100,
      nbIntPart:
        total === 0 ? 0 : (donnees[donnees.length - 1].nbIntPart / total) * 100,
    };

    return donnees;
  }

  constructor(props) {
    super(props);
    this.state = {
      donnee: [],
    };
  }

  componentWillMount() {
    myAxios()
      .get(pathTransmissionCampagne + this.props.id + pathAvancement)
      .then((res) => {
        const tableauModifRaw = MapObjects(res.data.datas, "progress");
        const tableauModif = TableauCollecte.calculTotaux(tableauModifRaw);
        this.setState({ donnee: tableauModif });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { donnee } = this.state;
    return (
      <>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Partition</th>
              <th>Nombre d'unités enquêtées</th>
              <th>Internet reçu</th>
              <th>Papier reçu</th>
              <th>Internet + Papier reçu</th>
              <th>PND</th>
              <th>HC</th>
              <th>Refus</th>
              <th>Autres déchets</th>
              <th>Total déchets</th>
              <th>Total reçu</th>
              <th>Internet partiellement complété</th>
            </tr>
          </thead>
          <tbody>
            {donnee.map(
              ({
                nbUe,
                numeroDeLot,
                nbIntRecu,
                nbPapRecu,
                nbPND,
                nbHC,
                nbRefus,
                nbAutresDechets,
                nbIntPart,
              }) => (
                <VagueCollecte
                  nbUe={nbUe}
                  numeroDeLot={numeroDeLot}
                  nbIntRecu={nbIntRecu}
                  nbPapRecu={nbPapRecu}
                  nbPND={nbPND}
                  nbHC={nbHC}
                  nbRefus={nbRefus}
                  nbAutresDechets={nbAutresDechets}
                  nbIntPart={nbIntPart}
                  key={numeroDeLot}
                />
              )
            )}
          </tbody>
        </table>
      </>
    );
  }
}
