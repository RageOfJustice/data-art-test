import React from 'react';
import {
  Typography,
  Grid,
  IconButton,
  Popover,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import {
  usePopupState,
  bindPopover,
  bindToggle,
} from 'material-ui-popup-state/hooks';

interface Props {
  text: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ListHeader: React.FC<Props> = ({ text, onEdit, onDelete }) => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'delete-popup',
  });
  return (
    <Grid container spacing={2} alignItems="center" wrap="nowrap">
      <Grid item xs>
        <Typography variant="h5" style={{ wordBreak: 'break-word' }}>
          {text}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <IconButton onClick={onEdit}>
          <Edit />
        </IconButton>
        <IconButton {...bindToggle(popupState)} color="secondary">
          <Delete />
        </IconButton>
      </Grid>
      <Popover {...bindPopover(popupState)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onDelete}>
            Yes
          </Button>
        </DialogActions>
      </Popover>
    </Grid>
  );
};

export default ListHeader;
