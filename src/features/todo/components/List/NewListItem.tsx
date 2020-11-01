import React, { useState, useCallback } from 'react';
import { ListItem as MuiListItem, ListItemText } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import EditTextInput from './EditTextInput';

interface Props {
  onFinishEditing?: (text: string) => void;
}

const NewListItem: React.FC<Props> = ({ onFinishEditing }) => {
  const [addMode, setAddMode] = useState(false);
  const handleEdit = useCallback(
    (newText: string) => {
      if (newText) {
        onFinishEditing?.(newText);
      }
      setAddMode(false);
    },
    [onFinishEditing]
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
      <ListItemText>
        <Add color="secondary" />
      </ListItemText>
    </MuiListItem>
  );
};

export default NewListItem;
