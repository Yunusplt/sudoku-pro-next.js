import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import GridOnIcon from "@mui/icons-material/GridOn";
import DialogContent from "@mui/material/DialogContent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { example_1, example_2, example_3 } from "@/data/sudokuData";
import { setIsOpenDialog, setSudokuValues } from "@/redux/sudokuSlice";
import {
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";

const ExampleSelectorDialog = () => {
  //! redux
  const dispatch = useAppDispatch();
  const { isOpenDialog } = useAppSelector((state) => state.sudoku);

  //! functions
  const handleClose = () => {
    dispatch(setIsOpenDialog(false));
  };

  const handleOnClick = (example: number[][]) => {
    dispatch(setSudokuValues(example));
    handleClose();
  };

  return (
    <Dialog
      open={isOpenDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Wähle ein Sudoku-Beispiel zum Starten
      </DialogTitle>
      <DialogContent>
        <List component="nav">
          <ListItemButton onClick={() => handleOnClick(example_1)}>
            <ListItemIcon>
              <GridOnIcon />
            </ListItemIcon>
            <ListItemText primary="Beispiel_1" />
          </ListItemButton>
          <ListItemButton onClick={() => handleOnClick(example_2)}>
            <ListItemIcon>
              <GridOnIcon />
            </ListItemIcon>
            <ListItemText primary="Beispiel_2" />
          </ListItemButton>
          <ListItemButton onClick={() => handleOnClick(example_3)}>
            <ListItemIcon>
              <GridOnIcon />
            </ListItemIcon>
            <ListItemText primary="Beispiel_3" />
          </ListItemButton>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ExampleSelectorDialog;
