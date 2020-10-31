import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from '@material-ui/core';
import { Done } from '@material-ui/icons';

interface Props {
  text: string;
  onFinishEditing?: (newText: string) => void;
}

const InputListItem: React.FC<Props> = ({ text, onFinishEditing }) => {
  const [newText, setNewText] = useState(text);

  return (
    <ListItem>
      <ListItemText>
        <TextField
          onChange={(e) => setNewText(e.target.value)}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onFinishEditing?.(newText);
            }
          }}
          placeholder="What to do?"
          value={newText}
        />
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => onFinishEditing?.(newText)}>
          <Done />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default InputListItem;
