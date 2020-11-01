import React, { useState } from 'react';
import { Paper, Box, Button } from '@material-ui/core';

import EditTextInput from './EditTextInput';

interface Props {
  onFinishEditing?: (text: string) => void;
}

const NewListButton: React.FC<Props> = ({ onFinishEditing }) => {
  const [addMode, setAddMode] = useState(false);

  const changeListName = (newName: string) => {
    setAddMode(false);

    if (newName) {
      onFinishEditing?.(newName);
    }
  };

  if (addMode) {
    return (
      <Paper>
        <Box p={2}>
          <EditTextInput text="" onFinishEditing={changeListName} />
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
