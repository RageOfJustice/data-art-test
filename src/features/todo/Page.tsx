import React, { useEffect } from 'react';
import { Grid, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/database';

import { todoActions, todoSelectors } from './slice';
import { List, NewListButton } from './components';

import type { AppDispatch } from '../store';

const db = firebase.database();

const Page: React.FC = () => {
  const lists = useSelector(todoSelectors.listSelectors.selectAll);
  const dispatch = useDispatch<AppDispatch>();

  // TODO: move to custom hook?
  useEffect(() => {
    (async () => {
      const snapshot = await db.ref().once('value');

      // firebase does not store empty arrays
      const transformList = ({ itemIDs = [], ...rest }: any): TODOList => ({
        ...rest,
        itemIDs,
      });

      let resLists: TODOList[] = [];
      let resItems: TODOItem[] = [];
      if (snapshot.exists()) {
        const { lists = [], items = [] } = snapshot.val();
        resLists = (Object.values(lists) as TODOList[]).map(transformList);
        resItems = Object.values(items) as TODOItem[];
      }

      dispatch(todoActions.setLists(resLists));
      dispatch(todoActions.setItems(resItems));

      // FIXME: should be converted into server's tz
      const NOW = Date.now();

      db.ref('items').on('child_changed', (snapshot) => {
        if (snapshot.exists()) {
          dispatch(todoActions.updateItem(snapshot.val()));
        }
      });
      db.ref('items')
        .orderByChild('timestamp')
        .startAt(NOW)
        .on('child_added', (snapshot) => {
          if (snapshot.exists()) {
            dispatch(todoActions.addItem(snapshot.val()));
          }
        });

      db.ref('lists').on('child_changed', (snapshot) => {
        if (snapshot.exists()) {
          const list = transformList(snapshot.val());
          dispatch(todoActions.updateList(list));
        }
      });
      db.ref('lists').on('child_removed', (snapshot) => {
        if (snapshot.exists()) {
          const list = transformList(snapshot.val());
          dispatch(todoActions.deleteLocalList(list));
        }
      });
      db.ref('lists')
        .orderByChild('timestamp')
        .startAt(NOW)
        .on('child_added', (snapshot) => {
          if (snapshot.exists()) {
            const list = transformList(snapshot.val());
            dispatch(todoActions.addList(list));
          }
        });
    })();

    return () => {
      db.ref('items').off();
      db.ref('lists').off();
    };
  }, [dispatch]);
  return (
    <Box py={2}>
      <Grid container spacing={2}>
        {lists.map((list) => (
          <Grid key={list.id} item xs={12} sm={6} md={4} lg={3}>
            <List list={list} />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <NewListButton />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
