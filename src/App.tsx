import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppFrame from './AppFrame';

const App = () => {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  );
};

export default App;
