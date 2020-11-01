import React, { useState, useCallback } from 'react';
import {
  ListItem as MuiListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useDispatch } from 'react-redux';

import EditTextInput from './EditTextInput';
import { AppDispatch } from 'src/features/store';
import { todoActions } from '../../slice';

interface Props {
  listID: string;
}

const NewListItem: React.FC<Props> = ({ listID }) => {
  const [addMode, setAddMode] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleEdit = useCallback(
    (newText: string) => {
      if (newText) {
        dispatch(todoActions.createTODOItem({ text: newText, listID }));
      }
      setAddMode(false);
    },
    [dispatch, listID]
  );

  if (addMode) {
    return (
      <MuiListItem>
        <EditTextInput onFinishEditing={handleEdit} text="" />
      </MuiListItem>
    );
  }

  return (
    <MuiListItem button onClick={() => setAddMode(true)}>
      <ListItemIcon>
        <Add color="secondary" />
      </ListItemIcon>
      <ListItemText primary="Add new todo" />
    </MuiListItem>
  );
};

export default NewListItem;
