import PropTypes from 'prop-types';
import React from 'react';
import LigneRelance from './ligneRelance';

export default function VagueRelance(props) {
  const { donnees } = props;

  const maxNbSu = new Map();

  const addNbToMax = (numlot, nb) => {
    let max = maxNbSu.get(numlot);
    if (max === undefined) {
      max = 0;
    }
    maxNbSu.set(numlot, nb + max);
  };

  donnees.forEach(({ numlot, nb }) => {
    addNbToMax(numlot, nb);
  });
  const getMax = numLot => maxNbSu.get(numLot);

  const dataWithTot = donnees
    .map(element => ({ ...element, nbTotal: getMax(element.numlot) }))
    .sort((a, b) => a.numlot - b.numlot)
    .sort((a, b) => a.freq - b.freq);

  const addNb = (data, previousData) => {
    if (previousData === undefined) {
      return data;
    }
    return data.map(element => {
      const previousElementWithSameNumlot = previousData.filter(
        e => e.numlot === element.numlot
      )[0];
      if (previousElementWithSameNumlot === undefined) {
        return element;
      }
      return { ...element, nb: element.nb + previousElementWithSameNumlot.nb };
    });
  };

  const structuredData = [];
  const freqMax = donnees.reduce((max, line) => (line.freq > max ? line.freq : max), 0);
  const filteredData = value => dataWithTot.filter(line => line.freq === value);
  const updateFreq = (previousData, newFreq) =>
    previousData.map(followupData => ({ ...followupData, freq: newFreq }));
  let x;
  let previousData;
  for (x = freqMax; x > 0; x -= 1) {
    let data = filteredData(x);

    if (!(Array.isArray(data) && data.length)) {
      data = updateFreq(previousData, x);
    } else {
      data = addNb(data, previousData);
      previousData = data;
    }

    structuredData[x] = { numRelance: x, data };
  }

  const numlots = [...new Set(donnees.map(line => line.numlot))];

  const completeBlock = block => {
    const blockNumLots = block.data.map(line => line.numlot);
    const completedBlock = block;
    numlots.forEach(num => {
      if (!blockNumLots.includes(num)) {
        completedBlock.data.push({ freq: 1, nb: 0, nbTotal: maxNbSu.get(num), numlot: num });
        completedBlock.data = block.data.sort((a, b) => a.numlot - b.numlot);
      }
    });
    return completedBlock;
  };

  structuredData.map(block => completeBlock(block));
  return (
    <>
      {structuredData.length === 0 && <div>Aucune relance pour cette enquête.</div>}
      {structuredData.length !== 0 && (
        <table className="table table-bordered colored-table">
          <thead>
            <tr>
              <th className="no-border" />
              <th>Lot</th>
              <th>Nombre d'unités enquêtées</th>
              <th>Nombre d'unités relancées</th>
              <th>% d'unités relancées</th>
            </tr>
          </thead>
          <tbody>
            {structuredData.map(bloc => (
              <LigneRelance numRelance={bloc.numRelance} data={bloc.data} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

VagueRelance.propTypes = {
  donnees: PropTypes.arrayOf(
    PropTypes.shape({
      nb: PropTypes.number.isRequired,
      freq: PropTypes.number.isRequired,
      numlot: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
};
