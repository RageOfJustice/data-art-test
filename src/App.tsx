import React from 'react';
import { Container, CssBaseline } from '@material-ui/core';

import Page from './features/todo/Page';

function App() {
  return (
    <Container>
      <CssBaseline />
      <Page />
    </Container>
  );
}

export default App;
