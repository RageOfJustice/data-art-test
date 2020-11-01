import React, { useCallback, useState } from 'react';
import {
  ListItem as MUIListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  makeStyles,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

import EditTextInput from './EditTextInput';

const useClasses = makeStyles(({ palette }) => ({
  cotnainer: {
    '& .MuiListItemSecondaryAction-root': {
      display: 'none',
    },
    '&:hover .MuiListItemSecondaryAction-root': {
      display: 'block',
    },
  },
  text: ({ done }: { done?: boolean }) => ({
    transition: 'all .2s linear',
    fontSize: done ? '0.9rem' : undefined,
    color: done ? palette.grey[300] : undefined,
    fontStyle: done ? 'italic' : undefined,
  }),
}));

interface Props {
  item: TODOItem;
  onCheck?: (newValue: boolean) => void;
  onFinishEditing?: (text: string) => void;
}

const ListItem: React.FC<Props> = ({
  onCheck,
  onFinishEditing,
  item: { text = '', done = false },
}) => {
  const [editMode, setEditMode] = useState(false);
  const handleEdit = useCallback(
    (newText: string) => {
      setEditMode(false);
      if (newText) {
        onFinishEditing?.(newText);
      }
    },
    [onFinishEditing]
  );
  const handleCheck = useCallback(() => {
    onCheck?.(!done);
  }, [onCheck, done]);

  const classes = useClasses({ done });

  if (editMode) {
    return (
      <MUIListItem>
        <EditTextInput onFinishEditing={handleEdit} text={text} />
      </MUIListItem>
    );
  }

  return (
    <MUIListItem
      ContainerProps={{ className: classes.cotnainer }}
      button
      onClick={handleCheck}
    >
      <ListItemIcon>
        <Checkbox
          color="default"
          disableRipple
          edge="start"
          checked={done}
          disabled={done}
        />
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ className: classes.text }}
        primary={text}
      />
      {!done && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => setEditMode(true)}>
            <Edit fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </MUIListItem>
  );
};

export default ListItem;
