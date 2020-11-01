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
import { useDispatch, useSelector } from 'react-redux';

import EditTextInput from './EditTextInput';
import type { AppDispatch, AppState } from 'src/features/store';
import { todoActions, todoSelectors } from '../../slice';

const useClasses = makeStyles(({ palette }) => ({
  cotnainer: {
    listStyle: 'none',
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
  itemID: string;
}

const ListItem: React.FC<Props> = ({ itemID }) => {
  const [editMode, setEditMode] = useState(false);
  const item = useSelector((state: AppState) =>
    todoSelectors.itemSelectors.selectById(state, itemID)
  );

  const text = item?.text ?? '';
  const done = item?.done;

  const dispatch = useDispatch<AppDispatch>();
  const handleEdit = useCallback(
    (newText: string) => {
      setEditMode(false);
      if (newText && item) {
        dispatch(todoActions.updateTODOItem({ ...item, text: newText }));
      }
    },
    [dispatch, item]
  );

  const handleCheck = useCallback(() => {
    if (item) {
      dispatch(todoActions.updateTODOItem({ ...item, done: !item.done }));
    }
  }, [dispatch, item]);

  const classes = useClasses({ done });

  if (editMode) {
    return (
      <MUIListItem>
        <EditTextInput onFinishEditing={handleEdit} text={text} />
      </MUIListItem>
    );
  }

  return (
    <MUIListItem ContainerProps={{ className: classes.cotnainer }}>
      <ListItemIcon>
        <Checkbox
          color="default"
          onClick={handleCheck}
          edge="start"
          checked={done}
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
