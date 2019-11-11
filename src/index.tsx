import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <App jsonUrl={process.env.REACT_APP_PROTO_JSON_URL || ''} />,
  document.getElementById('root')
);
