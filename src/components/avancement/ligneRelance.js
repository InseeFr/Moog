import PropTypes from "prop-types";
import React from "react";

const LigneRelance = ({ numRelance, data }) => {
  const firstColumn = { label: numRelance, length: data.length };
  const nbTotal = data.reduce((sum, line) => sum + line.nbTotal, 0);
  const nb = data.reduce((sum, line) => sum + line.nb, 0);
  const total = {
    numlot: "Total",
    nbTotal,
    nb,
    freq: numRelance,
  };

  const firstLine = data[0];
  const otherLines = data.slice(1);

  const lineWithData = (lineData, firstCell) => {
    const id =
      firstCell !== undefined
        ? firstCell.label
        : `${lineData.freq}${lineData.numlot}`;
    return (
      <tr key={id}>
        {firstCell !== undefined && (
          <td
            key={`followup${id}`}
            rowSpan={firstCell.length + 1}
            className="centrer verticaligned"
          >
            {`${firstCell.label}e relance`}
          </td>
        )}
        <td key={`numlot${id}`}>{lineData.numlot}</td>
        <td key={`nbtotal${id}`}>{lineData.nbTotal}</td>
        <td key={`nb${id}`}>{lineData.nb}</td>
        <td key={`prct${id}`}>
          {lineData.nbTotal === 0
            ? 0
            : Math.round((lineData.nb / lineData.nbTotal) * 1000) / 10}
        </td>
      </tr>
    );
  };

  return (
    <>
      {lineWithData(firstLine, firstColumn)}
      {otherLines.map((line) => lineWithData(line, undefined))}
      {lineWithData(total, undefined)}
    </>
  );
};

export default LigneRelance;
LigneRelance.propTypes = {
  numRelance: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nb: PropTypes.number.isRequired,
      freq: PropTypes.number.isRequired,
      numlot: PropTypes.string.isRequired,
      nbTotal: PropTypes.number.isRequired,
    })
  ).isRequired,
};
