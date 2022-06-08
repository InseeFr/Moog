import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainContainer from 'containers/main';
import estGestionnaire, { estAssistance } from 'utils/roles';
import './app.css';
import VersionComponent from '../version/version';

export default function App({ roles }) {
  const isGestionnaire = estGestionnaire(roles);
  const isAssistance = estAssistance(roles);
  return (
    <>
      {(isAssistance || isGestionnaire) && (
        <BrowserRouter>
          <Switch>
            <Route path="/:id" render={routeProps => <MainContainer {...routeProps} />} />
            <Route exact path="/" render={routeProps => <MainContainer {...routeProps} />} />
          </Switch>
        </BrowserRouter>
      )}
      {!isAssistance && !isGestionnaire && (
        <>
          <h1>{`Vous n'êtes pas autorisé à accéder à cette application`}</h1>
          <VersionComponent />
        </>
      )}
    </>
  );
}
