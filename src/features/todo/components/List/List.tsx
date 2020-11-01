import React, { useState } from 'react';
import { List as MUIList, Paper, Box } from '@material-ui/core';

import firebase from 'firebase/app';
import 'firebase/database';

import ListItem from './ListItem';
import ListHeader from './ListHeader';
import NewListItem from './NewListItem';
import EditTextInput from './EditTextInput';

const db = firebase.database();

interface Props {
  list: TODOList;
}

const List: React.FC<Props> = ({ list: { items = [], name, id } }) => {
  const toggleItem = ({ done }: TODOItem, index: number) => {
    db.ref(`lists/${id}/items/${index}/done`).set(!done);
  };

  const changeItemText = (index: number, newText: string) => {
    db.ref(`lists/${id}/items/${index}/text`).set(newText.trim());
  };
  const addItem = (newText: string) => {
    db.ref(`lists/${id}/items`).transaction((items) => {
      if (!items) {
        return [{ id: 0, text: newText.trim() }];
      }

      return [...items, { id: items.length, text: newText.trim() }];
    });
  };

  const [editMode, setEditMode] = useState(false);

  const changeListName = (newName: string) => {
    setEditMode(false);

    if (newName) {
      db.ref(`lists/${id}/name`).set(newName);
    }
  };

  const deleteList = () => {
    db.ref(`lists/${id}`).set(null);
  };

  return (
    <Paper>
      <Box p={2}>
        {editMode ? (
          <EditTextInput
            placeholder="Enter TODO list name"
            text={name}
            onFinishEditing={changeListName}
          />
        ) : (
          <ListHeader
            text={name}
            onDelete={deleteList}
            onEdit={() => setEditMode(true)}
          />
        )}

        <MUIList dense>
          {items.map((item, index) => (
            <ListItem
              item={item}
              onCheck={() => toggleItem(item, index)}
              onFinishEditing={(newText) => changeItemText(index, newText)}
              key={item.id}
            />
          ))}
          <NewListItem onFinishEditing={addItem} />
        </MUIList>
      </Box>
    </Paper>
  );
};

export default List;
