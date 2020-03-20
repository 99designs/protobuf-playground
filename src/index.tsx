import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <App
    jsonUrl={process.env.REACT_APP_PROTO_JSON_URL || ''}
    title={process.env.REACT_APP_WEBSITE_TITLE || ''}
    twirpBaseUrl={
      process.env.REACT_APP_TWIRP_BASE_URL || 'https://example.com/api'
    }
  />,
  document.getElementById('root')
);
