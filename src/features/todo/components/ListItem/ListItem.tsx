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

import InputListItem from './InputListItem';

const useClasses = makeStyles({
  container: {
    '& .MuiListItemSecondaryAction-root': {
      display: 'none',
    },
    '&:hover .MuiListItemSecondaryAction-root': {
      display: 'block',
    },
  },
});

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
      onFinishEditing?.(newText);
    },
    [onFinishEditing]
  );
  const handleCheck = useCallback(() => {
    onCheck?.(!done);
  }, [onCheck, done]);

  const classes = useClasses();

  if (editMode) {
    return <InputListItem onFinishEditing={handleEdit} text={text} />;
  }

  return (
    <MUIListItem classes={classes} button onClick={handleCheck}>
      <ListItemIcon>
        <Checkbox disableRipple edge="start" checked={done} />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
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
