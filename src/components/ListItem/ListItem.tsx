import React, { useCallback, useState } from 'react';
import {
  ListItem as MUIListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

import InputListItem from './InputListItem';

interface Props {
  children: string;
  onCheck?: (newValue: boolean) => void;
  done?: boolean;
  onFinishEditing?: (text: string) => void;
}

const ListItem: React.FC<Props> = ({
  onCheck,
  onFinishEditing,
  children = '',
  done = false,
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

  if (editMode) {
    return <InputListItem onFinishEditing={handleEdit} text={children} />;
  }

  return (
    <MUIListItem button onClick={handleCheck}>
      <ListItemIcon>
        <Checkbox edge="start" checked={done} />
      </ListItemIcon>
      <ListItemText>{children}</ListItemText>
      {!done && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => setEditMode(true)}>
            <Edit />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </MUIListItem>
  );
};

export default ListItem;
