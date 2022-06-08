import React from 'react';
import imgPreloader from 'img/loader.svg';
import './loader.css';

const Preloader = () => (
  <>
    <div className="preloader">
      <img src={imgPreloader} alt="waiting..." />
      <h2>Veuillez patienter</h2>
      <h3>Les données sont en approche.</h3>
    </div>
  </>
);

export default Preloader;
