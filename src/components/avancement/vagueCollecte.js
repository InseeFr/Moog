import React from "react";
import PropTypes from "prop-types";

export default function VagueCollecte(props) {
  const {
    nbUe,
    numeroDeLot,
    nbIntRecu,
    nbPapRecu,
    nbPND,
    nbHC,
    nbRefus,
    nbAutresDechets,
    nbIntPart,
  } = props;
  return (
    <tr id={numeroDeLot}>
      <td>{numeroDeLot}</td>
      <td>{nbUe}</td>
      <td>{Math.round(nbIntRecu * 10) / 10}</td>
      <td>{Math.round(nbPapRecu * 10) / 10}</td>
      <td>{Math.round((nbIntRecu + nbPapRecu) * 10) / 10}</td>
      <td>{Math.round(nbPND * 10) / 10}</td>
      <td>{Math.round(nbHC * 10) / 10}</td>
      <td>{Math.round(nbRefus * 10) / 10}</td>
      <td>{Math.round(nbAutresDechets * 10) / 10}</td>
      <td>
        {Math.round((nbPND + nbHC + nbRefus + nbAutresDechets) * 10) / 10}
      </td>
      <td>
        {Math.round(
          (nbIntRecu + nbPapRecu + nbPND + nbHC + nbRefus + nbAutresDechets) *
            10
        ) / 10}
      </td>
      <td>{Math.round(nbIntPart * 10) / 10}</td>
    </tr>
  );
}

VagueCollecte.propTypes = {
  nbUe: PropTypes.number.isRequired,
  numeroDeLot: PropTypes.string.isRequired,
  nbIntRecu: PropTypes.number.isRequired,
  nbPapRecu: PropTypes.number.isRequired,
  nbPND: PropTypes.number.isRequired,
  nbHC: PropTypes.number.isRequired,
  nbRefus: PropTypes.number.isRequired,
  nbAutresDechets: PropTypes.number.isRequired,
  nbIntPart: PropTypes.number.isRequired,
};
