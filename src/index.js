import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AuthContainer from 'containers/auth';
import store from 'store/configure-store';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <AuthContainer />
  </Provider>,
  document.getElementById('root')
);
