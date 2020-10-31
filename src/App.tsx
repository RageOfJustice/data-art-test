import React from 'react';
import { List, Container, CssBaseline } from '@material-ui/core';
import { ListItem } from './components';

const data = [
  {
    id: '1',
    text: 'Hello',
    done: false,
  },
  {
    id: '2',
    text: 'Duck',
    done: true,
  },
];

function App() {
  return (
    <Container>
      <CssBaseline />
      <List>
        {data.map(({ text, done, id }, index) => (
          <ListItem done={done} key={id}>
            {text}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
