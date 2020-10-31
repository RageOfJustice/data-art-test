import React, { useState } from 'react';
import {
  List as MUIList,
  Paper,
  Box,
  Typography,
  Grid,
  IconButton,
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

import firebase from 'firebase/app';
import 'firebase/database';

import ListItem from './ListItem';
import EditableText from './EditableText';

const db = firebase.database();

interface Props {
  list: TODOList;
}

const List: React.FC<Props> = ({ list: { items, name, id } }) => {
  const toggleItem = ({ parentID, done }: TODOItem, index: number) => {
    db.ref(`lists/${parentID}/items/${index}/done`).set(!done);
  };

  const changeItemText = (
    { parentID }: TODOItem,
    index: number,
    newText: string
  ) => {
    db.ref(`lists/${parentID}/items/${index}/text`).set(newText.trim());
  };

  const [editMode, setEditMode] = useState(false);

  const changeListName = (newName: string) => {
    setEditMode(false);

    if (newName) {
      db.ref(`lists/${id}/name`).set(newName);
    }
  };

  return (
    <Box>
      <Paper>
        <Box p={2}>
          {editMode ? (
            <EditableText text={name} onFinishEditing={changeListName} />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs>
                <Typography variant="h5">{name}</Typography>
              </Grid>
              <Grid item xs="auto">
                <IconButton onClick={() => setEditMode(true)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary">
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          )}
          <MUIList>
            {items.map((item, index) => (
              <ListItem
                item={item}
                onCheck={() => toggleItem(item, index)}
                onFinishEditing={(newText) =>
                  changeItemText(item, index, newText)
                }
                key={item.id}
              />
            ))}
          </MUIList>
        </Box>
      </Paper>
    </Box>
  );
};

export default List;
