import React, { useEffect, useState } from 'react';
import { Container, CssBaseline, Grid, Box } from '@material-ui/core';

import { List, NewListButton } from './features/todo/components';

import firebase from 'firebase/app';
import 'firebase/database';

const db = firebase.database();

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

  const addNewList = (newName: string) => {
    const ref = db.ref('lists').push();
    ref.set({
      name: newName,
      id: ref.key,
    });
  };

  return (
    <Container>
      <CssBaseline />
      <Box py={2}>
        <Grid container spacing={2}>
          {lists.map((list) => (
            <Grid key={list.id} item xs={12} md={6} lg={3}>
              <List list={list} />
            </Grid>
          ))}
          <Grid item xs={12} md={6} lg={3}>
            <NewListButton onFinishEditing={addNewList} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
