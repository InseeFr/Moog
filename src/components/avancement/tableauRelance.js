import React, { Component } from 'react';
import myAxios from 'utils/api-call';
import '../../index.css';
import { pathRelance, pathTransmissionCampagne } from '../../utils/properties';
import VagueRelance from './vagueRelance';
import MapObjects from '../utils/jsonUtils';

export default class TableauRelance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donnee: [],
    };
  }

  componentWillMount() {
    myAxios()
      .get(pathTransmissionCampagne + this.props.id + pathRelance)
      .then(res => {
        const data = MapObjects(res.data.datas, 'followup');
        this.setState({ donnee: data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { donnee } = this.state;
    if (!donnee.length > 0) {
      return <div>Données en cours de chargement.</div>;
    }
    return <VagueRelance donnees={donnee} />;
  }
}
