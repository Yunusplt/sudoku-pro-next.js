import React from "react";
import { Box, Button } from "@mui/material";
import { emptySudoku } from "@/data/sudokuData";
import { setIsOpenDialog } from "@/redux/sudokuSlice";
import { useSudokuSolver } from "@/hooks/useSudokuSolver";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ActionButtons = () => {
  //! redux
  const dispatch = useAppDispatch();
  const { sudokuValues } = useAppSelector((state) => state.sudoku);

  //! custom hook
  const { startAutoSolve } = useSudokuSolver();

  //! functions
  const handleOnclick = () => {
    if (sudokuValues === emptySudoku) {
      alert("Laden Sie bitte zuerst ein Beispiel!");
    } else {
      startAutoSolve();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 3, mt: 5 }}>
      <Button
        variant="contained"
        onClick={() => dispatch(setIsOpenDialog(true))}
      >
        Sudoku laden
      </Button>
      <Button variant="contained" color="success" onClick={handleOnclick}>
        Sudoku lösen
      </Button>
    </Box>
  );
};

export default ActionButtons;
