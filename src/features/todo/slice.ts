import {
  createSlice,
  createEntityAdapter,
  combineReducers,
  createAsyncThunk,
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit';
import arrayMove from 'array-move';

import firebase from 'firebase/app';
import 'firebase/database';

import type { AppState } from '../store';

const db = firebase.database();

const changeTODOItemsOrders = createAsyncThunk<
  void,
  { id: string; oldIndex: number; newIndex: number }
>(`TODOList/changeTODOItemsOrders`, async ({ id, oldIndex, newIndex }) => {
  await db
    .ref(`lists/${id}/itemIDs`)
    .transaction((items) => arrayMove(items, oldIndex, newIndex));
});
const createTODOList = createAsyncThunk<void, string>(
  `TODOList/createTODOList`,
  async (newName) => {
    const ref = db.ref('lists').push();

    await ref.set({
      name: newName,
      id: ref.key,
      timestamp: Date.now(),
    });
  }
);

const createTODOItem = createAsyncThunk<void, { listID: string; text: string }>(
  `TODOItem/createTODOItem`,
  async ({ text, listID }) => {
    const itemRef = db.ref('items').push();
    await itemRef.set({
      id: itemRef.key,
      text: text.trim(),
      listID,
      timestamp: Date.now(),
    });

    await db.ref(`lists/${listID}/itemIDs`).transaction((items) => {
      if (!items) {
        return [itemRef.key];
      }

      return [...items, itemRef.key];
    });
  }
);

const updateTODOItem = createAsyncThunk<void, AtLeast<TODOItem, 'id'>>(
  `TODOItem/updateTODOItem`,
  async (item) => {
    await db.ref(`items/${item.id}`).update(item);
  }
);

const deleteTODOList = createAsyncThunk<void, TODOList>(
  `TODOList/deleteTODOList`,
  async ({ id, itemIDs }) => {
    await db.ref(`lists/${id}`).remove();
    const updates = itemIDs.reduce<Record<string, null>>((acc, itemID) => {
      acc[`/${itemID}`] = null;
      return acc;
    }, {});

    await db.ref('items').update(updates);
  }
);

const updateTODOList = createAsyncThunk<void, AtLeast<TODOList, 'id'>>(
  `TODOList/updateTODOList`,
  async (list) => {
    await db.ref(`lists/${list.id}`).update(list);
  }
);

const deleteLocalList = createAction<TODOList>('deleteLocalList');

const itemAdapter = createEntityAdapter<TODOItem>();

const itemSlice = createSlice({
  name: 'TODOItem',
  initialState: itemAdapter.getInitialState(),
  reducers: {
    setItems: (state, action: PayloadAction<TODOItem[]>) => {
      itemAdapter.setAll(state, action);
    },
    addItem: (state, action: PayloadAction<TODOItem>) => {
      itemAdapter.upsertOne(state, action);
    },
    updateItem: (
      state,
      { payload: { id }, payload }: PayloadAction<TODOItem>
    ) => {
      itemAdapter.updateOne(state, { id, changes: payload });
    },
  },
  extraReducers: (builder) =>
    builder.addCase(deleteLocalList, (state, action) => {
      itemAdapter.removeMany(state, action.payload.itemIDs);
    }),
});

const listAdapter = createEntityAdapter<TODOList>();

const listSlice = createSlice({
  name: 'TODOList',
  initialState: listAdapter.getInitialState(),
  reducers: {
    setLists: (state, action: PayloadAction<TODOList[]>) => {
      listAdapter.setAll(state, action);
    },
    addList: (state, action: PayloadAction<TODOList>) => {
      listAdapter.upsertOne(state, action);
    },

    updateList: (
      state,
      { payload: { id }, payload }: PayloadAction<TODOList>
    ) => {
      listAdapter.updateOne(state, { id, changes: payload });
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        itemSlice.actions.addItem,
        (state, { payload: { listID, id } }) => {
          state.entities[listID]?.itemIDs.push(id);
        }
      )
      .addCase(deleteLocalList, (state, action) => {
        listAdapter.removeOne(state, action.payload.id);
      }),
});

const itemSelectors = itemAdapter.getSelectors<AppState>(
  (state) => state.todo.items
);
const listSelectors = listAdapter.getSelectors<AppState>(
  (state) => state.todo.lists
);

export const todoSelectors = {
  itemSelectors,
  listSelectors,
};

export const todoActions = {
  deleteLocalList,
  createTODOList,
  createTODOItem,
  updateTODOItem,
  deleteTODOList,
  updateTODOList,
  changeTODOItemsOrders,
  ...itemSlice.actions,
  ...listSlice.actions,
};

export default combineReducers({
  items: itemSlice.reducer,
  lists: listSlice.reducer,
});
