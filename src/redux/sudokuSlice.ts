import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptySudoku } from "@/data/sudokuData";

interface SudokuState {
  sudokuValues: number[][];
  squaresToCompare: string[] | null;
  isOpenDialog: boolean;
}

const initialState: SudokuState = {
  sudokuValues: emptySudoku,
  squaresToCompare: null,
  isOpenDialog: false,
};

const sudokuSlice = createSlice({
  name: "sudoku",
  initialState,
  reducers: {
    setSudokuValues: (state, action: PayloadAction<number[][]>) => {
      state.sudokuValues = action.payload;
    },
    setSquaresToCompare: (state, action: PayloadAction<string[] | null>) => {
      state.squaresToCompare = action.payload;
    },
    setIsOpenDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenDialog = action.payload;
    },
  },
});

export const { setSudokuValues, setSquaresToCompare, setIsOpenDialog } =
  sudokuSlice.actions;

export default sudokuSlice.reducer;
