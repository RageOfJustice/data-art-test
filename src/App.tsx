import React, { useEffect, useState } from 'react';
import { Container, CssBaseline, Grid } from '@material-ui/core';

import { List } from './features/todo/components';

import firebase from 'firebase/app';
import 'firebase/database';

const db = firebase.database();
// const ref = db.ref('lists').push();
// ref.set({
//   name: 'test',
//   id: ref.key,
//   items: [
//     {
//       parentID: ref.key,
//       id: '1',
//       text: 'Hello',
//       done: false,
//     },
//     {
//       parentID: ref.key,
//       id: '2',
//       text: 'Duck',
//       done: true,
//     },
//   ],
// });

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

    return () => {
      db.ref('lists').off('value');
    };
  }, []);

  return (
    <Container>
      <CssBaseline />
      <Grid container spacing={2}>
        {lists.map((list) => (
          <Grid key={list.id} item xs={12} md={6} lg={3}>
            <List list={list} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
