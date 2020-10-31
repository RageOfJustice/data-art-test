import React, { useState, useMemo } from 'react';
import { ListItem, IconButton, TextField } from '@material-ui/core';
import { Done, Cancel } from '@material-ui/icons';

interface Props {
  text: string;
  onFinishEditing?: (newText: string) => void;
}

const InputListItem: React.FC<Props> = ({ text, onFinishEditing }) => {
  const [newText, setNewText] = useState(text);

  const disabled = useMemo(() => {
    if (!newText.trim()) {
      return true;
    }

    return /[<>\\#${}]+/.test(newText);
  }, [newText]);

  return (
    <ListItem>
      <TextField
        autoFocus
        onChange={(e) => setNewText(e.target.value)}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled) {
            onFinishEditing?.(newText);
          }
        }}
        placeholder="What to do?"
        error={disabled}
        helperText={
          disabled && 'Text must not contain <, >, \\, #, $, {, } or be empty'
        }
        value={newText}
      />

      <IconButton onClick={() => onFinishEditing?.('')}>
        <Cancel fontSize="small" />
      </IconButton>
      <IconButton
        disabled={disabled}
        color="primary"
        onClick={() => onFinishEditing?.(newText)}
      >
        <Done fontSize="small" />
      </IconButton>
    </ListItem>
  );
};

export default InputListItem;
