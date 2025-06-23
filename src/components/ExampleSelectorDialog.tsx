import * as React from "react";
import ExampleTabs from "./ExampleTabs";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { setIsOpenDialog } from "@/redux/sudokuSlice";
import DialogContent from "@mui/material/DialogContent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ExampleSelectorDialog = () => {
  //! redux
  const dispatch = useAppDispatch();
  const { isOpenDialog } = useAppSelector((state) => state.sudoku);

  //! functions
  const handleClose = () => {
    dispatch(setIsOpenDialog(false));
  };

  return (
    <Dialog open={isOpenDialog} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        Wähle ein Sudoku-Beispiel zum Starten
      </DialogTitle>
      <DialogContent>
        <ExampleTabs handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ExampleSelectorDialog;
