import React, { useState } from 'react';
import { List as MUIList, Paper, Box } from '@material-ui/core';

import firebase from 'firebase/app';
import 'firebase/database';

import ListItem from './ListItem';
import ListHeader from './ListHeader';
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

  const deleteList = () => {
    db.ref(`lists/${id}`).set(null);
  };

  return (
    <Box>
      <Paper>
        <Box p={2}>
          {editMode ? (
            <EditableText text={name} onFinishEditing={changeListName} />
          ) : (
            <ListHeader
              text={name}
              onDelete={deleteList}
              onEdit={() => setEditMode(true)}
            />
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
