import React, { useState, useMemo } from 'react';
import { IconButton, TextField, Grid } from '@material-ui/core';
import { Done, Cancel } from '@material-ui/icons';

interface Props {
  text: string;
  onFinishEditing?: (newText: string) => void;
}

const EditableText: React.FC<Props> = ({ text, onFinishEditing }) => {
  const [newText, setNewText] = useState(text);

  const disabled = useMemo(() => {
    if (!newText.trim()) {
      return true;
    }

    return /[<>\\#${}]+/.test(newText);
  }, [newText]);

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <TextField
          autoFocus
          onChange={(e) => setNewText(e.target.value)}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !disabled) {
              onFinishEditing?.(newText);
            }
          }}
          onBlur={() => {
            onFinishEditing?.('');
          }}
          placeholder="What to do?"
          error={disabled}
          helperText={
            disabled && 'Text must not contain <, >, \\, #, $, {, } or be empty'
          }
          value={newText}
        />
      </Grid>

      <Grid item xs="auto">
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
      </Grid>
    </Grid>
  );
};

export default EditableText;
