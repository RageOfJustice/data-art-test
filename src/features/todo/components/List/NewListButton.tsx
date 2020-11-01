import React, { useState } from 'react';
import { Paper, Box, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import EditTextInput from './EditTextInput';

import type { AppDispatch } from 'src/features/store';
import { todoActions } from '../../slice';

const NewListButton: React.FC = () => {
  const [addMode, setAddMode] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const changeListName = (newName: string) => {
    setAddMode(false);

    if (newName) {
      dispatch(todoActions.createTODOList(newName));
    }
  };

  if (addMode) {
    return (
      <Paper>
        <Box p={2}>
          <EditTextInput
            placeholder="Enter TODO list name"
            text=""
            onFinishEditing={changeListName}
          />
        </Box>
      </Paper>
    );
  }

  return (
    <Button
      fullWidth
      color="primary"
      variant="contained"
      onClick={() => setAddMode(true)}
    >
      Create new list
    </Button>
  );
};

export default NewListButton;
