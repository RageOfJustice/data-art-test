import React, { useState, useMemo } from 'react';
import { IconButton, TextField, Grid } from '@material-ui/core';
import { Done, Cancel } from '@material-ui/icons';

interface Props {
  text: string;
  placeholder?: string;
  onFinishEditing?: (newText: string) => void;
}

const EditTextInput: React.FC<Props> = ({
  text,
  placeholder = 'What to do?',
  onFinishEditing,
}) => {
  const [newText, setNewText] = useState(text);
  const [touched, setTouched] = useState(false);

  const disabled = useMemo(() => {
    if (!newText.trim()) {
      return true;
    }

    return /[<>\\#${}]+/.test(newText);
  }, [newText]);
  const showError = disabled && touched;

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <TextField
          autoFocus
          onChange={(e) => {
            if (!touched) {
              setTouched(true);
            }
            setNewText(e.target.value);
          }}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !disabled) {
              onFinishEditing?.(newText);
            } else if (e.key === 'Escape') {
              onFinishEditing?.('');
            }
          }}
          placeholder={placeholder}
          error={showError}
          helperText={
            showError &&
            'Text must not contain <, >, \\, #, $, {, } or be empty'
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

export default EditTextInput;
