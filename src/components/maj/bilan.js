import React from 'react';

export default function Bilan(props) {
  return (
    <div>
      <h2 style={{ color: 'blue' }}>{props.data.ok} infoSuiviGestions correctement importées</h2>
      <div style={{ color: 'red' }}>
        <h2>Liste d'idue en erreur :</h2>
        {props.data.listError.map(item => (
          <ul key={item}>{item.id}</ul>
        ))}
      </div>
    </div>
  );
}
