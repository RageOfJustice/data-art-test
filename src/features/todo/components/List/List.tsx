import React, { useState } from 'react';
import { List as MUIList, Paper, Box } from '@material-ui/core';
import {
  SortableContainer,
  SortableElement,
  SortEndHandler,
} from 'react-sortable-hoc';

import { useDispatch } from 'react-redux';

import ListItem from './ListItem';
import ListHeader from './ListHeader';
import NewListItem from './NewListItem';
import EditTextInput from './EditTextInput';

import { todoActions } from '../../slice';
import { AppDispatch } from 'src/features/store';

interface Props {
  list: TODOList;
}

const SortableItem = SortableElement(ListItem);
const SortableList = SortableContainer(MUIList);

const List: React.FC<Props> = ({ list: { name, id, itemIDs }, list }) => {
  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const changeListName = (newName: string) => {
    setEditMode(false);

    if (newName) {
      dispatch(todoActions.updateTODOList({ id, name: newName }));
    }
  };

  const deleteList = () => {
    dispatch(todoActions.deleteTODOList(list));
  };

  const changeSorting: SortEndHandler = (indicies) => {
    dispatch(todoActions.changeTODOItemsOrders({ ...indicies, id }));
  };

  return (
    <Paper>
      <Box p={2}>
        {editMode ? (
          <EditTextInput
            placeholder="Enter TODO list name"
            text={name}
            onFinishEditing={changeListName}
          />
        ) : (
          <ListHeader
            text={name}
            onDelete={deleteList}
            onEdit={() => setEditMode(true)}
          />
        )}

        <SortableList dense onSortEnd={changeSorting} distance={10}>
          {itemIDs.map((id, index) => (
            <SortableItem index={index} itemID={id} key={id} />
          ))}
          <NewListItem listID={id} />
        </SortableList>
      </Box>
    </Paper>
  );
};

export default List;
