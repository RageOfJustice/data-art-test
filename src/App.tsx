import React, { useEffect, useState } from 'react';
import { List, Container, CssBaseline, Grid } from '@material-ui/core';
import { ListItem } from './components';

import firebase from 'firebase/app';
import 'firebase/database';

const db = firebase.database();
// const ref = db.ref('lists').push();
// ref.set({
//   name: 'test',
//   id: ref.key,
//   items: [
//     {
//       id: '1',
//       text: 'Hello',
//       done: false,
//     },
//     {
//       id: '2',
//       text: 'Duck',
//       done: true,
//     },
//   ],
// });

interface TODOItem {
  text: string;
  done?: boolean;
  id: string;
}

interface TODOList {
  id: string;
  name: string;
  items: TODOItem[];
}

function App() {
  const [lists, setLists] = useState<TODOList[]>([]);

  useEffect(() => {
    db.ref('lists').on('value', (snapshot) => {
      if (snapshot.exists()) {
        setLists(Object.values(snapshot.val()) as TODOList[]);
      } else {
        setLists([]);
      }
    });
  }, []);
  return (
    <Container>
      <CssBaseline />
      <Grid container spacing={2}>
        {lists.map(({ items, id }) => (
          <Grid key={id} item xs={12} md={6} lg={3}>
            <List>
              {items.map(({ text, done, id }) => (
                <ListItem done={done} key={id}>
                  {text}
                </ListItem>
              ))}
            </List>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
